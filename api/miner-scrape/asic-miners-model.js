const db = require("../data/db-config");

const getAll = async () => {
  const asics = await db("market_data as market")
    .join("miner_data as miner", "miner.model", "market.model")
    .select(
      "market.vendor",
      "market.price",
      "market.date",
      "market.model",
      "miner.th",
      "miner.watts",
      'miner.efficiency'
    ).orderBy('date', 'desc')
  return asics;
};

const getAllIds = async () => {
  const asics = await db("market_data as market")
    .join("miner_data as miner", "miner.model", "market.model")
    .select(
      "market.id",
      "market.vendor",
      "market.price",
      "market.date",
      "market.model",
      "miner.th",
      "miner.watts",
      'miner.efficiency'
    );
  return asics;
};

module.exports = {
  getAll,
  getAllIds,
};
