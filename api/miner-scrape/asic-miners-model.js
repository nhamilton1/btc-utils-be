const db = require("../data/db-config");

const getAll = async () => {
  const asics = await db("asic_data").select(
    "seller",
    "model",
    "th",
    "watts",
    "efficiency",
    "price",
    "date"
  );
  return asics;
};

const add = async (item) => {
  const asicData = item.map((x) => ({
    id: x.id,
    seller: x.seller,
    model: x.model,
    th: x.th,
    watts: x.watts,
    efficiency: x.efficiency,
    price: x.price,
    date: x.date,
  }));
  const [newItemObject] = await db("asic_data").insert(asicData, [
    "id",
    "seller",
    "model",
    "th",
    "watts",
    "efficiency",
    "price",
    "date",
  ]);
  return newItemObject;
};

const getAllIds = async () => {
  const asics = await db("asic_data").select(
    "id",
    "seller",
    "model",
    "th",
    "watts",
    "efficiency",
    "price",
    "date"
  );
  return asics;
};

module.exports = {
  getAll,
  add,
  getAllIds,
};
