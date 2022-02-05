const db = require("../data/db-config");

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
  addMinerData,
};
