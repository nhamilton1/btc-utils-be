"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllIds = exports.getAll = void 0;
const db_config_1 = require("../../data/db-config");
const getAll = async () => {
    const asics = await (0, db_config_1.db)("market_data as market")
        .join("miner_data as miner", "miner.model", "market.model")
        .select("market.vendor", "market.price", "market.date", "market.model", "miner.th", "miner.watts", 'miner.efficiency').orderBy('date', 'desc');
    return asics;
};
exports.getAll = getAll;
const getAllIds = async () => {
    const asics = await (0, db_config_1.db)("market_data as market")
        .join("miner_data as miner", "miner.model", "market.model")
        .select("market.id", "market.vendor", "market.price", "market.date", "market.model", "miner.th", "miner.watts", 'miner.efficiency');
    return asics;
};
exports.getAllIds = getAllIds;
