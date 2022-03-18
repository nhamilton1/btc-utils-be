"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMinerData = exports.getMinerData = void 0;
const db_config_1 = require("../../data/db-config");
const getMinerData = async () => {
    const minerData = await (0, db_config_1.db)("miner_data").select("model", "th", "watts", "efficiency");
    return minerData;
};
exports.getMinerData = getMinerData;
const addMinerData = async (item) => {
    const minerData = item.map((x) => ({
        model: x.model,
        th: x.th,
        watts: x.watts,
        efficiency: x.efficiency,
    }));
    const [newItemObject] = await (0, db_config_1.db)("miner_data").insert(minerData, [
        "model",
        "th",
        "watts",
        "efficiency",
    ]);
    return newItemObject;
};
exports.addMinerData = addMinerData;
