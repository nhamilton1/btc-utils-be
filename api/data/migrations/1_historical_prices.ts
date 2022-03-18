import { Knex } from "knex";

export const up = async (knex: Knex): Promise<any> => {
  return knex.schema.createTable("historical_prices", (table) => {
    table.string("date", 10).unique();
    table.float("btc_price");
    table.float("gld_price");
    table.float("spy_price");
  });
};

export const down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("historical_prices");
};
