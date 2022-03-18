"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const knex_cleaner_1 = __importDefault(require("knex-cleaner"));
const seed = (knex) => {
    return knex_cleaner_1.default.clean(knex, {
        mode: "truncate",
        ignoreTables: ["knex_migrations", "knex_migrations_lock"],
    });
};
exports.seed = seed;
