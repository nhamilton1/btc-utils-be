import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type MarketData = {
  id: string;
  vendor: string;
  price: number;
  date: string;
  model: string;
  th: number;
  watts: number;
  efficiency: number;
};

export const getAll = async (): Promise<MarketData[]> => {
  const allAsics: MarketData[] = await prisma.$queryRaw`
    SELECT 
    market_data.vendor, market_data.price, market_data.date, market_data.model, 
    miner_data.th, miner_data.watts, miner_data.efficiency
    FROM "market_data"
    INNER JOIN "miner_data" ON market_data.model = miner_data.model  
  `;
  return allAsics;
};
