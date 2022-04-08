import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMinerData = async () => {
  const minerData = await prisma.minerData.findMany();
  return minerData;
};

type minerDataType = {
  model: string;
  th: number;
  watts: number;
  efficiency: number;
};

async function createMinerData(
  data: Prisma.minerDataCreateManyInput[]
): Promise<Prisma.BatchPayload> {
  return await prisma.minerData.createMany({ data, skipDuplicates: true });
}

export const addMinerData = async (item: minerDataType[]) => {
  return await createMinerData(item);
};
