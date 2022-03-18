"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historicPriceRouter = void 0;
const historic_prices_middleware_1 = require("./historic-prices-middleware");
const historic_prices_model_1 = require("./historic-prices-model");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.historicPriceRouter = router;
router.get("/:date_string?", historic_prices_middleware_1.scrapeDates, async (req, res, next) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    if (!startDate || !endDate) {
        res.status(404).json({ error: "Dataset not found" });
        return;
    }
    if (typeof startDate !== "string" || typeof endDate !== "string") {
        res.status(500).json({ error: "Invalid dataset" });
        return;
    }
    try {
        const btc_historic = await (0, historic_prices_model_1.sqlRawFindBetweenDates)(startDate, endDate);
        res.json(btc_historic);
    }
    catch (err) {
        next(err);
    }
});
