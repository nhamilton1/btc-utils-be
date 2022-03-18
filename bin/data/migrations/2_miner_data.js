"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (knex) => {
    return knex.schema.createTable("miner_data", (table) => {
        table.string("model");
        table.float("th");
        table.float("watts");
        table.float("efficiency");
    });
};
exports.up = up;
const down = async (knex) => {
    return knex.schema.dropTableIfExists("miner_data");
};
exports.down = down;
