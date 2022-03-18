"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (knex) => {
    return knex.schema.createTable('users', (users) => {
        users.increments('user_id');
        users.string('username', 200).notNullable();
        users.string('password', 200).notNullable();
        users.timestamps(false, true);
    });
};
exports.up = up;
const down = async (knex) => {
    return knex.schema.dropTableIfExists("users");
};
exports.down = down;
