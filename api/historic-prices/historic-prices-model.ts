import { db } from "../data/db-config";

export const sqlRawFindBetweenDates = async (
  startDate: string,
  endDate: string
) => {
  const dates = await db
    .with(
      "historical_prices",
      ["date", "btc_price", "spy_price", "gld_price"],
      db.raw(
        'SELECT date, btc_price, spy_price, gld_price, MAX(CASE WHEN spy_price IS NOT NULL THEN date END) OVER(ORDER BY date ROWS UNBOUNDED PRECEDING) AS spy, MAX(CASE WHEN gld_price IS NOT NULL THEN date END) OVER( ORDER BY date ROWS UNBOUNDED PRECEDING ) AS gld from "historical_prices"'
      )
    )
    .select(
      "date",
      "btc_price",
      db.raw(
        "MAX(spy_price) OVER( PARTITION BY spy ORDER BY date ROWS UNBOUNDED PRECEDING ) AS spy_price"
      ),
      db.raw(
        "MAX(gld_price) OVER( PARTITION BY gld ORDER BY date ROWS UNBOUNDED PRECEDING ) AS gld_price"
      )
    )
    .from("historical_prices")
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .orderBy("date", "ASC");
  return dates;
};

export const add = async (item: any[]) => {
  const updatedDates = item.map(
    (
      x
    ): {
      date: string;
      btc_price: number;
      spy_price: number;
      gld_price: number;
    } => ({
      date: x.date,
      btc_price: x.btc_price,
      spy_price: x.spy_price,
      gld_price: x.gld_price,
    })
  );
  const [newItemObject] = await db("historical_prices").insert(updatedDates, [
    "date",
    "btc_price",
    "spy_price",
    "gld_price",
  ]);
  return newItemObject;
};

export const getLastRow = async () => {
  const getLastRow = await db("historical_prices")
    .select("date", "btc_price", "spy_price", "gld_price")
    .orderBy("date", "DESC")
    .limit(1);
  return getLastRow;
};
