import { defaults } from "pg";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

if (process.env.DATABASE_URL) {
  defaults.ssl = { rejectUnauthorized: false };
}

const prisma = new PrismaClient();

const getInvalidDate = async () => {
  return await prisma.marketData.deleteMany({
    where: {
      date: {
        lt: "Invalid date",
      },
    },
  });
};

const deleteInvalidDate = async () => {
  console.time("time");
  try {
    const invalidDate = await getInvalidDate();
    console.log(invalidDate);
  } catch (err) {
    console.error(err);
  }
  console.timeEnd("time");
};

deleteInvalidDate()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
