"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = exports.data = void 0;
const btc_historic_json_1 = __importDefault(require("../json/btc_historic.json"));
const spy_historic_json_1 = __importDefault(require("../json/spy_historic.json"));
const gld_historic_json_1 = __importDefault(require("../json/gld_historic.json"));
let newSpy = [];
let newGld = [];
// finds the missing weekend dates from the spy and gld seed and adds the btc date and a null price.
btc_historic_json_1.default.map((x) => spy_historic_json_1.default.map((s) => s.spy_date).indexOf(x.btc_date) === -1
    ? newSpy.push({ spy_date: x.btc_date, spy_price: null })
    : "");
btc_historic_json_1.default.map((x) => gld_historic_json_1.default.map((s) => s.gld_date).indexOf(x.btc_date) === -1
    ? newGld.push({ gld_date: x.btc_date, gld_price: null })
    : "");
// adds already existing dates
spy_historic_json_1.default.map((x) => newSpy.push({ spy_date: x.spy_date, spy_price: x.spy_price }));
gld_historic_json_1.default.map((x) => newGld.push({ gld_date: x.gld_date, gld_price: x.gld_price }));
//sorts by the date
newSpy.sort((a, b) => new Date(a.spy_date) - new Date(b.spy_date));
newGld.sort((a, b) => new Date(a.gld_date) - new Date(b.gld_date));
exports.data = btc_historic_json_1.default.map((_date, idx) => {
    return {
        date: btc_historic_json_1.default[idx].btc_date,
        btc_price: btc_historic_json_1.default[idx].btc_price,
        spy_price: newSpy[idx].spy_price,
        gld_price: newGld[idx].gld_price,
    };
});
const seed = async (knex) => {
    return await knex("historical_prices").insert(exports.data);
};
exports.seed = seed;
