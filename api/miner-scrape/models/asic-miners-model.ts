import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAll = async () => {
  const allAsics = await prisma.$queryRaw`
    SELECT 
    market_data.vendor, market_data.price, market_data.date, market_data.model, 
    miner_data.th, miner_data.watts, miner_data.efficiency
    FROM "market_data"
    INNER JOIN "miner_data" ON market_data.model = miner_data.model  
  `;
  console.log(allAsics);
  return allAsics;
};
