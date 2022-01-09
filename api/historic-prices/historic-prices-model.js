const db = require("../data/db-config");

const findBetweenDates = async (startDate, endDate) => {
  const dates = await db("historical_prices")
    .select("date", "btc_price", "gld_price", "spy_price")
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date", "ASC");
  return dates;
};

const add = async (item) => {
  const updatedDates = item.map((x) => ({
    date: x.date,
    btc_price: x.btc_price,
    spy_price: x.spy_price,
    gld_price: x.gld_price,
  }));
  const [newItemObject] = await db("historical_prices").insert(updatedDates, [
    "date",
    "btc_price",
    "spy_price",
    "gld_price",
  ]);
  return newItemObject
};

const getLastRow = async () => {
    const lastRow = await db("historical_prices")
    .select("date", "btc_price", "gld_price", "spy_price")
    .orderBy("date", "DESC")
    .limit(1)
    return lastRow
}

module.exports = {
  findBetweenDates,
  add,
  getLastRow,
};
