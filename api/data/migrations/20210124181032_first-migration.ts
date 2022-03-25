import { Knex } from "knex";

export const up = async (knex: Knex): Promise<any> => {
  return knex.schema.createTable('users', (users) => {
    users.increments('user_id')
    users.string('username', 200).notNullable()
    users.string('password', 200).notNullable()
    users.timestamps(false, true)
  })
};

export const down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("users");
};