import { Knex } from "knex";

export const up = async (knex: Knex): Promise<any> => {
  return knex.schema.createTable("miner_data", (table) => {
    table.string("model");
    table.float("th");
    table.float("watts");
    table.float("efficiency");
  });
};

export const down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("miner_data");
};