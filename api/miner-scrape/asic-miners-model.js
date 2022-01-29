const db = require("../data/db-config");

const getAll = async () => {
  const asics = await db("kaboomracks").select(
    "seller",
    "asic",
    "price",
    "date"
  );
  return asics;
};

const add = async (item) => {
  const asicData = item.map((x) => ({
    id: x.id,
    seller: x.seller,
    asic: x.asic,
    price: x.price,
    date: x.date,
  }));
  const [newItemObject] = await db("kaboomracks").insert(asicData, [
    "id",
    "seller",
    "asic",
    "price",
    "date",
  ]);
  return newItemObject;
};

const getAllIds = async () => {
  const asics = await db("kaboomracks").select(
    "id",
    "seller",
    "asic",
    "price",
    "date"
  );
  return asics;
}

module.exports = {
  getAll,
  add,
  getAllIds,
};
