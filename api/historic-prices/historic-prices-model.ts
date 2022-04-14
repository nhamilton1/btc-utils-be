import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface lastRowInterface {
  date: string
}

export const getLastRow = async () => {
  let lastRow: lastRowInterface = await prisma.$queryRaw`
  SELECT date FROM historical_prices
  ORDER BY date DESC  
  LIMIT 1
  `
  return lastRow;
};

type addHistoryData = {
  date: Date;
  btc_price: number;
  spy_price?: number | null;
  gld_price?: number | null;
};

async function createHistoricalPrices(
  data: Prisma.HistoricalPricesCreateManyInput[]
): Promise<Prisma.BatchPayload> {
  return await prisma.historicalPrices.createMany({
    data,
  });
}

export const add = async (item: addHistoryData[]) => {
  return await createHistoricalPrices(item);
};

export const sqlRawFindBetweenDates = async (
  startDate: string,
  endDate: string
) => {
  return await prisma.$queryRaw`
    WITH historical_prices (date, btc_price, spy_price, gld_price) as (
    SELECT date, btc_price, spy_price, gld_price, 
    MAX(CASE WHEN spy_price IS NOT NULL THEN date END) 
    OVER(ORDER BY date ROWS UNBOUNDED PRECEDING) 
    AS spy, MAX(CASE WHEN gld_price IS NOT NULL THEN date END) 
    OVER( ORDER BY date ROWS UNBOUNDED PRECEDING ) AS gld from historical_prices)
    SELECT date, btc_price,
    MAX(spy_price) OVER( PARTITION BY spy ORDER BY date ROWS UNBOUNDED PRECEDING ) AS spy_price,
    MAX(gld_price) OVER( PARTITION BY gld ORDER BY date ROWS UNBOUNDED PRECEDING ) AS gld_price
    FROM historical_prices
    WHERE date BETWEEN ${new Date(startDate)} and ${new Date(endDate)}
    ORDER BY date ASC
  `;
};
