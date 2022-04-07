import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const main = async () => {

  const allAsics = await prisma.marketData.findMany({
    
  })
  console.log(allAsics)

  return allAsics
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


// import { db } from "../../data/db-config";


// export const getAll = async () => {
//   const asics = await db("market_data as market")
//     .join("miner_data as miner", "miner.model", "market.model")
//     .select(
//       "market.vendor",
//       "market.price",
//       "market.date",
//       "market.model",
//       "miner.th",
//       "miner.watts",
//       'miner.efficiency'
//     ).orderBy('date', 'desc')
//   return asics;
// };

// export const getAllIds = async () => {
//   const asics = await db("market_data as market")
//     .join("miner_data as miner", "miner.model", "market.model")
//     .select(
//       "market.id",
//       "market.vendor",
//       "market.price",
//       "market.date",
//       "market.model",
//       "miner.th",
//       "miner.watts",
//       'miner.efficiency'
//     );
//   return asics;
// };
