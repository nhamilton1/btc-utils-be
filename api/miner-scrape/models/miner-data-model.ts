import { db } from "../../data/db-config";

const getMinerData = async () => {
  const minerData = await db("miner_data").select(
    "model",
    "th",
    "watts",
    "efficiency",
  );
  return minerData
};

const addMinerData = async (item) => {
  const minerData = item.map((x) => ({
    model: x.model,
    th: x.th,
    watts: x.watts,
    efficiency: x.efficiency,
  }));
  const [newItemObject] = await db("miner_data").insert(minerData, [
    "model",
    "th",
    "watts",
    "efficiency",
  ]);
  return newItemObject;
};

module.exports = {
  getMinerData,
  addMinerData,
};
