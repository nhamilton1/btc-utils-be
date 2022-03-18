"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (knex) => {
    return knex.schema.createTable("market_data", (table) => {
        table.string("id").unique();
        table.string("vendor");
        table.string("model");
        table.float("price");
        table.string("date");
    });
};
exports.up = up;
const down = async (knex) => {
    return knex.schema.dropTableIfExists("market_data");
};
exports.down = down;
