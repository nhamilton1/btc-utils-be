import { knex } from "knex";
import { knexConfig } from "../knexfile";

const env: string = process.env.NODE_ENV as string;

export const db = knex(knexConfig[env]);
