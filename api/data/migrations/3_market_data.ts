import { Knex } from "knex";

export const up = async (knex: Knex): Promise<any> => {
  return knex.schema.createTable("market_data", (table) => {
    table.string("id").unique();
    table.string("vendor");
    table.string("model");
    table.float("price");
    table.string("date");
  });
};

export const down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("market_data");
};