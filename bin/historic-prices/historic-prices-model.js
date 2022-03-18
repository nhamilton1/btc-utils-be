"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastRow = exports.add = exports.sqlRawFindBetweenDates = void 0;
const db_config_1 = require("../data/db-config");
const sqlRawFindBetweenDates = async (startDate, endDate) => {
    const dates = await db_config_1.db
        .with("historical_prices", ["date", "btc_price", "spy_price", "gld_price"], db_config_1.db.raw('SELECT date, btc_price, spy_price, gld_price, MAX(CASE WHEN spy_price IS NOT NULL THEN date END) OVER(ORDER BY date ROWS UNBOUNDED PRECEDING) AS spy, MAX(CASE WHEN gld_price IS NOT NULL THEN date END) OVER( ORDER BY date ROWS UNBOUNDED PRECEDING ) AS gld from "historical_prices"'))
        .select("date", "btc_price", db_config_1.db.raw("MAX(spy_price) OVER( PARTITION BY spy ORDER BY date ROWS UNBOUNDED PRECEDING ) AS spy_price"), db_config_1.db.raw("MAX(gld_price) OVER( PARTITION BY gld ORDER BY date ROWS UNBOUNDED PRECEDING ) AS gld_price"))
        .from("historical_prices")
        .where("date", ">=", startDate)
        .where("date", "<=", endDate)
        .orderBy("date", "ASC");
    return dates;
};
exports.sqlRawFindBetweenDates = sqlRawFindBetweenDates;
const add = async (item) => {
    const updatedDates = item.map((x) => ({
        date: x.date,
        btc_price: x.btc_price,
        spy_price: x.spy_price,
        gld_price: x.gld_price,
    }));
    const [newItemObject] = await (0, db_config_1.db)("historical_prices").insert(updatedDates, [
        "date",
        "btc_price",
        "spy_price",
        "gld_price",
    ]);
    return newItemObject;
};
exports.add = add;
const getLastRow = async () => {
    const lastRow = await (0, db_config_1.db)("historical_prices")
        .select("date", "btc_price", "gld_price", "spy_price")
        .orderBy("date", "DESC")
        .limit(1);
    return lastRow;
};
exports.getLastRow = getLastRow;
