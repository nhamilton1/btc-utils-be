import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMarketData = async () => {
  const marketData = await prisma.marketData.findMany();
  return marketData;
};

type marketDataType = {
  id: string;
  vendor: string;
  model: string;
  price: number;
  date: Date;
};

async function createMarketData(
  data: Prisma.marketDataCreateManyInput[]
): Promise<Prisma.BatchPayload> {
  return await prisma.marketData.createMany({ data });
}

export const addMarketData = async (item: marketDataType[]) => {
  return await createMarketData(item);
};
