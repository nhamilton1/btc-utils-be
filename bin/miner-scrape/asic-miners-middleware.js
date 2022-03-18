"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kaboomracks_crawler_1 = __importDefault(require("./kaboomracks/kaboomracks-crawler"));
const minefarmbuy_crawler_1 = __importDefault(require("./minefarmbuy/minefarmbuy-crawler"));
const asic_miners_model_1 = require("./models/asic-miners-model");
const market_data_model_1 = require("./models/market-data-model");
const miner_data_model_1 = require("./models/miner-data-model");
// this takes up too much memory for heroku and would have to pay to use it.
// took up mem=643M(125.7%), last test used mem=727M(141.4%)
const asicData = async (req, res, next) => {
    try {
        const asic = await (0, asic_miners_model_1.getAllIds)();
        const minerInfo = await (0, miner_data_model_1.getMinerData)();
        const marketInfo = await (0, market_data_model_1.getMarketData)();
        const scrapeForMFBData = await (0, minefarmbuy_crawler_1.default)();
        const scrapeForKaboomData = await (0, kaboomracks_crawler_1.default)();
        const allData = scrapeForMFBData?.concat(scrapeForKaboomData);
        const minerInfoDupCheck = allData?.filter((scapeData) => !minerInfo.find((allAsicData) => scapeData.model === allAsicData.model));
        const marketInfoDupCheck = allData?.filter((scapeData) => !marketInfo.find((allAsicData) => scapeData.id === allAsicData.id));
        if (asic.length === 0) {
            const minerInfoFirstDupCheck = scrapeForMFBData?.filter((scapeData) => !scrapeForKaboomData?.find((allAsicData) => scapeData.model === allAsicData.model));
            const firstDataInput = minerInfoFirstDupCheck?.concat(scrapeForKaboomData);
            await (0, miner_data_model_1.addMinerData)(firstDataInput);
            await (0, market_data_model_1.addMarketData)(allData);
            next();
        }
        if (minerInfoDupCheck.length > 0) {
            await (0, miner_data_model_1.addMinerData)(minerInfoDupCheck);
        }
        if (marketInfoDupCheck.length > 0) {
            await (0, market_data_model_1.addMarketData)(marketInfoDupCheck);
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.default = asicData;
