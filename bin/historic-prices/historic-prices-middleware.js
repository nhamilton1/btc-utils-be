"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeDates = void 0;
const moment_1 = __importDefault(require("moment"));
const crawler_1 = require("./crawler");
const historic_prices_model_1 = require("./historic-prices-model");
const scrapeDates = async (req, res, next) => {
    try {
        const dateCheck = await (0, historic_prices_model_1.getLastRow)();
        let mostRecentDate = dateCheck[dateCheck.length - 1].date;
        let currDate = (0, moment_1.default)(new Date()).format("YYYY-MM-DD");
        if (mostRecentDate !== currDate) {
            const scrapingForUpdates = await (0, crawler_1.scrape)(mostRecentDate);
            if (!scrapingForUpdates)
                return next();
            await (0, historic_prices_model_1.add)(scrapingForUpdates);
            next();
        }
        else {
            next();
        }
    }
    catch (err) {
        next(err);
    }
};
exports.scrapeDates = scrapeDates;
