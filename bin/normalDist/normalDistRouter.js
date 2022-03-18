"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalDistRouter = void 0;
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const express = __importStar(require("express"));
const router = express.Router();
exports.normalDistRouter = router;
router.get('/sanity_test', (req, res) => {
    res.json('sanity test');
});
router.get('/pool_block_counter', async (req, res, next) => {
    let poolName = req.query.pool || 'SlushPool';
    let prev = (0, moment_1.default)().subtract(1, "months").startOf("months").toDate().toISOString();
    const [pyyyy, pmm, pdd] = prev.split(/T|:|-/);
    let dd = String(new Date().getDate()).padStart(2, '0');
    let mm = String(new Date().getMonth() + 1).padStart(2, '0'); //January is 0
    let yyyy = new Date().getFullYear();
    let today = yyyy + mm + dd;
    let lastMonth = pyyyy + pmm + pdd;
    try {
        const response = await axios_1.default.get(`https://btc.com/service/poolBlockCounterPerDay?start=${lastMonth}&end=${today}&pool=${poolName}`);
        res.status(200).json(response.data);
    }
    catch (err) {
        next(err);
    }
});
