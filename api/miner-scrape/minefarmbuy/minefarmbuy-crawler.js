"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var moment_1 = require("moment");
var puppeteer_1 = require("puppeteer");
var helpers_1 = require("../helpers");
var minefarmbuyScraper = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, urls, filteredUrls, uniqUrls, minefarmbuyData, _i, _a, url, asicModel, incoterms, effici, filteredEfficiency, ifNoPriceFromAsicPrice, oos, hashOption, filterHashrateOptions, _b, _c, th, asicPrice, powerDraw, asicNameFilter, asicName, model, id, _d, _e, effic, hashrateOptionForEff, efficiencyHashrateOpt, _f, _g, th, asicPrice, model, id, err_1;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 40, , 41]);
                return [4 /*yield*/, puppeteer_1["default"].launch({
                        slowMo: 5,
                        args: ["--no-sandbox", "--disable-setuid-sandbox"]
                    })];
            case 1:
                // adding slowMo: 5 fixes the bug where asics with just the hashrate
                // option would push hashrates that were not there
                browser = _h.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _h.sent();
                return [4 /*yield*/, page.setViewport({ width: 1920, height: 1080 })];
            case 3:
                _h.sent();
                return [4 /*yield*/, page.setRequestInterception(true)];
            case 4:
                _h.sent();
                page.on("request", function (req) {
                    if (req.resourceType() == "stylesheet" ||
                        req.resourceType() == "font" ||
                        req.resourceType() == "image") {
                        req.abort();
                    }
                    else {
                        req["continue"]();
                    }
                });
                return [4 /*yield*/, page.goto("https://minefarmbuy.com/product-category/btc-asics/", {
                        waitUntil: "domcontentloaded"
                    })];
            case 5:
                _h.sent();
                return [4 /*yield*/, page.$$eval("#blog > div > div > div > div > article > div > ul > li > a ", function (title) { return title.map(function (url) { return url.href; }); })];
            case 6:
                urls = _h.sent();
                filteredUrls = urls.filter(function (word) {
                    return (word.includes("whatsminer-m") ||
                        word.includes("antminer-s") ||
                        word.includes("canaan-a"));
                });
                uniqUrls = __spreadArray([], new Set(filteredUrls), true);
                minefarmbuyData = [];
                _i = 0, _a = uniqUrls.values();
                _h.label = 7;
            case 7:
                if (!(_i < _a.length)) return [3 /*break*/, 38];
                url = _a[_i];
                return [4 /*yield*/, page.goto(url, { waitUntil: "domcontentloaded" })];
            case 8:
                _h.sent();
                return [4 /*yield*/, page.$eval("div > div.summary.entry-summary > h1", function (el) { return el.innerText; })];
            case 9:
                asicModel = _h.sent();
                return [4 /*yield*/, page.$$eval("#incoterms > option", function (node) {
                        return node.map(function (th) { return th.innerText; });
                    })];
            case 10:
                incoterms = _h.sent();
                return [4 /*yield*/, page.$$eval("#efficiency > option", function (node) {
                        return node.map(function (th) { return th.innerText; });
                    })];
            case 11:
                effici = _h.sent();
                filteredEfficiency = effici.filter(function (t) { return t.match(/J\/th/i); });
                return [4 /*yield*/, page.$$eval("div > div.summary.entry-summary > p > span > bdi", function (el) { return el.map(function (e) { return e.innerText; }); })];
            case 12:
                ifNoPriceFromAsicPrice = _h.sent();
                return [4 /*yield*/, page.$$eval("div > div.summary.entry-summary > form > p", function (el) { return el.map(function (e) { return e.innerText; }); })];
            case 13:
                oos = _h.sent();
                if (!(incoterms.length === 0 && filteredEfficiency.length === 0)) return [3 /*break*/, 21];
                return [4 /*yield*/, page.$$eval("#hashrate > option", function (node) {
                        return node.map(function (th) { return th.innerText; });
                    })];
            case 14:
                hashOption = _h.sent();
                filterHashrateOptions = hashOption.filter(function (t) {
                    return t.match(/th/i) && parseInt(t.charAt(0));
                });
                _b = 0, _c = filterHashrateOptions.values();
                _h.label = 15;
            case 15:
                if (!(_b < _c.length)) return [3 /*break*/, 20];
                th = _c[_b];
                return [4 /*yield*/, page.select("select#hashrate", th)];
            case 16:
                _h.sent();
                return [4 /*yield*/, page.$$eval("div > div > form > div > div > div > span > span > bdi", function (node) { return node.map(function (price) { return price.innerText; }); })];
            case 17:
                asicPrice = _h.sent();
                return [4 /*yield*/, page.$eval("#tab-additional_information > table > tbody > tr.woocommerce-product-attributes-item.woocommerce-product-attributes-item--attribute_power-draw > td", function (el) { return el.innerText; })];
            case 18:
                powerDraw = _h.sent();
                asicNameFilter = "".concat(asicModel.replace(/\s+(\W)/g, "$1"), " abc");
                asicName = asicNameFilter.match(/(?=Whatsminer\s*).*?(?=\s*abc)/gs) ||
                    asicNameFilter.match(/(?=Antminer\s*).*?(?=\s*abc)/gs) ||
                    asicNameFilter.match(/(?=Canaan\s*).*?(?=\s*abc)/gs);
                model = "".concat(asicName[0], " ").concat(Number(th.split(/th/i)[0]), "T");
                id = "minefarmbuy ".concat(model, " ").concat(asicPrice[0] === undefined
                    ? Number(ifNoPriceFromAsicPrice[0].replace("$", "").replace(",", ""))
                    : Number(asicPrice[0].replace("$", "").replace(",", "")));
                minefarmbuyData.push({
                    vendor: "minefarmbuy",
                    model: model,
                    th: Number(th.split(/th/i)[0]),
                    watts: (0, helpers_1.convertPowerDraw)(powerDraw, th),
                    efficiency: (0, helpers_1.convertEfficiency)(powerDraw, th),
                    price: asicPrice[0] === undefined
                        ? Number(ifNoPriceFromAsicPrice[0].replace("$", "").replace(",", ""))
                        : Number(asicPrice[0].replace("$", "").replace(",", "")),
                    date: (0, moment_1["default"])(new Date()).format("MM-DD-YYYY"),
                    id: (0, helpers_1.sha1)(id)
                });
                _h.label = 19;
            case 19:
                _b++;
                return [3 /*break*/, 15];
            case 20: return [3 /*break*/, 37];
            case 21:
                if (!(filteredEfficiency.length > 0)) return [3 /*break*/, 36];
                _d = 0, _e = filteredEfficiency.values();
                _h.label = 22;
            case 22:
                if (!(_d < _e.length)) return [3 /*break*/, 35];
                effic = _e[_d];
                return [4 /*yield*/, page.select("select#efficiency", effic)];
            case 23:
                _h.sent();
                return [4 /*yield*/, page.$$eval("#hashrate > option", function (node) { return node.map(function (th) { return th.innerText; }); })];
            case 24:
                hashrateOptionForEff = _h.sent();
                efficiencyHashrateOpt = hashrateOptionForEff.filter(function (t) {
                    return t.match(/th/i) && parseInt(t.charAt(0));
                });
                _f = 0, _g = efficiencyHashrateOpt.values();
                _h.label = 25;
            case 25:
                if (!(_f < _g.length)) return [3 /*break*/, 31];
                th = _g[_f];
                return [4 /*yield*/, page.select("select#hashrate", th)];
            case 26:
                _h.sent();
                return [4 /*yield*/, page.$$eval("div > div > form > div > div > div > span > span > bdi", function (node) { return node.map(function (price) { return price.innerText; }); })];
            case 27:
                asicPrice = _h.sent();
                if (!(asicPrice.length === 0)) return [3 /*break*/, 29];
                return [4 /*yield*/, page.$$eval("div > div.summary.entry-summary > p > span > bdi", function (node) { return node.map(function (price) { return price.innerText; }); })];
            case 28:
                asicPrice = _h.sent();
                _h.label = 29;
            case 29:
                model = "".concat(asicModel, " ").concat(th.split(/th/i)[0], "T ").concat(effic.split(/j\/th/i)[0], "J/th");
                id = "minefarmbuy ".concat(model, " ").concat(Number(asicPrice[0].replace("$", "").replace(",", "")));
                minefarmbuyData.push({
                    vendor: "minefarmbuy",
                    model: model,
                    th: Number(th.split(/th/i)[0]),
                    watts: (0, helpers_1.convertPowerDraw)(effic, th),
                    efficiency: Number(effic.split(/j\/th/i)[0]),
                    price: Number(asicPrice[0].replace("$", "").replace(",", "")),
                    date: (0, moment_1["default"])(new Date()).format("MM-DD-YYYY"),
                    id: (0, helpers_1.sha1)(id)
                });
                _h.label = 30;
            case 30:
                _f++;
                return [3 /*break*/, 25];
            case 31: 
            //puts choose an option back on both to reset selection, was having issues
            //where it would stick to previous value.
            return [4 /*yield*/, page.select("select#efficiency", "Choose an option")];
            case 32:
                //puts choose an option back on both to reset selection, was having issues
                //where it would stick to previous value.
                _h.sent();
                return [4 /*yield*/, page.select("select#hashrate", "Choose an option")];
            case 33:
                _h.sent();
                _h.label = 34;
            case 34:
                _d++;
                return [3 /*break*/, 22];
            case 35: return [3 /*break*/, 37];
            case 36: return [3 /*break*/, 38];
            case 37:
                _i++;
                return [3 /*break*/, 7];
            case 38: return [4 /*yield*/, browser.close()];
            case 39:
                _h.sent();
                return [2 /*return*/, minefarmbuyData];
            case 40:
                err_1 = _h.sent();
                console.error("Could not create a browser instance => : ", err_1);
                return [3 /*break*/, 41];
            case 41: return [2 /*return*/];
        }
    });
}); };
exports["default"] = minefarmbuyScraper;
