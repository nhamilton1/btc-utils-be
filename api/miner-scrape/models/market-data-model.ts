import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMarketData = async () => {
  const marketData = await prisma.marketData.findMany();
  return marketData;
};

export const addMarketData = async (item) => {
  const marketData = await prisma.marketData.create({
    data: {
      date: item.date,
      model: item.model,
      price: item.price,
      vendor: item.vendor,
      id: item.id,
    },
  });
  return marketData;
};

// import { db } from "../../data/db-config";

// export const getMarketData = async () => {
//   const marketData = await db("market_data").select(
//     "id",
//     "vendor",
//     "model",
//     "price",
//     "date"
//   );
//   return marketData;
// };

// export const addMarketData = async (item) => {
//   const marketData = item.map((x) => ({
//     id: x.id,
//     vendor: x.vendor,
//     model: x.model,
//     price: x.price,
//     date: x.date,
//   }));
//   const [newItemObject] = await db("market_data").insert(marketData, [
//     "id",
//     "vendor",
//     "model",
//     "price",
//     "date",
//   ]);
//   return newItemObject;
// };
