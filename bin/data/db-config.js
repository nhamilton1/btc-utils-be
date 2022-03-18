"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const knex_1 = require("knex");
const configs = require('../../knexfile');
const env = process.env.NODE_ENV;
exports.db = (0, knex_1.knex)(configs[env]);
