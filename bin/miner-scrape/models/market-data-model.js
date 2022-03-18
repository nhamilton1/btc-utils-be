"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMarketData = exports.getMarketData = void 0;
const db_config_1 = require("../../data/db-config");
const getMarketData = async () => {
    const marketData = await (0, db_config_1.db)("market_data").select("id", "vendor", "model", "price", "date");
    return marketData;
};
exports.getMarketData = getMarketData;
const addMarketData = async (item) => {
    const marketData = item.map((x) => ({
        id: x.id,
        vendor: x.vendor,
        model: x.model,
        price: x.price,
        date: x.date,
    }));
    const [newItemObject] = await (0, db_config_1.db)("market_data").insert(marketData, [
        "id",
        "vendor",
        "model",
        "price",
        "date",
    ]);
    return newItemObject;
};
exports.addMarketData = addMarketData;
