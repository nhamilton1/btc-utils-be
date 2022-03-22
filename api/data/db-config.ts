import { knex } from "knex";
const configs = require("../../knexfile");

const env: string = process.env.NODE_ENV as string;

export const db = knex(configs[env]);