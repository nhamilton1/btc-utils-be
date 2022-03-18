"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const asic_miners_router_1 = require("./miner-scrape/asic-miners-router");
const normalDistRouter_1 = require("./normalDist/normalDistRouter");
const historic_prices_router_1 = require("./historic-prices/historic-prices-router");
const server = (0, express_1.default)();
exports.server = server;
server.use(express_1.default.json());
server.use((0, helmet_1.default)());
server.use((0, cors_1.default)());
server.use("/api/nd", normalDistRouter_1.normalDistRouter);
server.use("/api/historic_prices", historic_prices_router_1.historicPriceRouter);
server.use("/api/asics", asic_miners_router_1.asicRouter);
server.use((err, _req, res, next) => {
    return res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack,
    });
});
