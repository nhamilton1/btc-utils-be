import knexCleaner from "knex-cleaner";
import { Knex } from "knex";

export const seed = (knex: Knex) => {
  return knexCleaner.clean(knex, {
    mode: "truncate",
    ignoreTables: ["knex_migrations", "knex_migrations_lock"],
  });
};
