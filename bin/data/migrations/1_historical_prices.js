"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (knex) => {
    return knex.schema.createTable("historical_prices", (table) => {
        table.string("date", 10).unique();
        table.float("btc_price");
        table.float("gld_price");
        table.float("spy_price");
    });
};
exports.up = up;
const down = async (knex) => {
    return knex.schema.dropTableIfExists("historical_prices");
};
exports.down = down;
