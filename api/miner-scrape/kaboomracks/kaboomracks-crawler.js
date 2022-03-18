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
exports.__esModule = true;
var axios_1 = require("axios");
var moment_1 = require("moment");
var helpers_1 = require("../helpers");
var asicWattList_1 = require("../asicWattList");
var cheerio_1 = require("cheerio");
var kaboomracksScraper = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, $miner_1, asics_1, ids_1, filtered, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1["default"].get("https://t.me/s/kaboomracks")];
            case 1:
                data = (_a.sent()).data;
                $miner_1 = (0, cheerio_1.load)(data);
                asics_1 = [];
                $miner_1("body > main > div > section > div > div > div > div.tgme_widget_message_text").each(function (_idx, el) {
                    var _a;
                    var minerData = $miner_1(el).text();
                    // this will filter out any posts that do not each in them
                    // they sell by lots some times.
                    var individualSales = minerData.match(/(?=[—]\s*).*?(?=\s*each —)/gs);
                    var moq = minerData.match(/(?=order \s*).*?(?=\s*ship)/g);
                    //adding this because it was messing up the regex, had to account for lot
                    if (moq === null) {
                        moq = minerData.match(/(?=each \s*).*?(?<=\s*lot)/g);
                    }
                    //tests for moq of 1
                    //TODO: TEST OUT THIS MOQ
                    var moqTest = moq === null || moq === void 0 ? void 0 : moq.map(function (ele) {
                        return ele
                            .split(" ")
                            .map(function (n) {
                            return typeof n === "string" && !Number.isNaN(Number(n)) ? Number(n) : null;
                        })
                            .filter(function (i) { return i; });
                    })[0];
                    if (
                    //might have to change this so it includes T versions
                    minerData.includes("Antminer S") &&
                        individualSales != null &&
                        moqTest[0] === 1) {
                        var vendor = "Kaboomracks";
                        var price = Number(minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)[0]);
                        // new way to check for date, if date is not valid it trys a different way
                        // usually there are two | which caused it to break
                        var date = (0, moment_1["default"])(new Date(minerData
                            .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
                            .replace(/[^\x20-\x7E]/g, "")
                            .split(" ")
                            .map(function (day) { return (day.includes(",") ? day.slice(0, -3) : day); })
                            .join(" "))).isValid()
                            ? (0, moment_1["default"])(new Date(minerData
                                .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
                                .replace(/[^\x20-\x7E]/g, "")
                                .split(" ")
                                .map(function (day) { return (day.includes(",") ? day.slice(0, -3) : day); })
                                .join(" "))).format("MM-DD-YYYY")
                            : (0, moment_1["default"])(new Date(minerData
                                .match(/(?<=usa\s+).*?(?=\s+Miners for)/gs)[0]
                                .replace(/[^\x20-\x7E]/g, "")
                                .replace("| ", "")
                                .split(" ")
                                .map(function (day) { return (day.includes(",") ? day.slice(0, -3) : day); })
                                .join(" "))).format("MM-DD-YYYY");
                        //this will find between the given strings, for exmample here:
                        //will find between Antminer S and for
                        var asicModel = minerData.match(/(?=Antminer S\s*).*?(?=\s*for)/gs)[0];
                        //gets the asic name without the th
                        var asicSearchName = minerData
                            .match(/(?=Bitmain Antminer S\s*).*?(?=\s*T)/gs)[0]
                            .split(" ")
                            .slice(0, -1)
                            .join(" ");
                        if (asicModel.includes("T") && !asicModel.includes("(")) {
                            var th = Number(asicModel
                                .split(" ")
                                .filter(function (e) {
                                return e.includes("T") && Number.isInteger(Number(e[0])) ? e[0] : null;
                            })[0]
                                .replace("T", ""));
                            var asicName = asicModel.match(/(?=Antminer S\s*).*?(?=\s*T)/gs);
                            //gets the watts from the asic watt list, remove the t from the th var
                            //if there isnt a match it will take the wt and * it by the th
                            var watts = asicWattList_1.asicWattList[asicSearchName][th] !== undefined
                                ? asicWattList_1.asicWattList[asicSearchName][th]
                                : asicWattList_1.asicWattList[asicSearchName]["wt"] * Number(th);
                            //added tofixed, was getting a really long decimal place
                            var efficiency = Number((watts / th).toFixed(1));
                            var model = "".concat(asicName[0], "T");
                            var id = vendor + model + price + date;
                            asics_1.push({
                                vendor: vendor,
                                model: model,
                                th: th,
                                watts: watts,
                                efficiency: efficiency,
                                price: price,
                                date: date,
                                id: (0, helpers_1.sha1)(id)
                            });
                        }
                        else if (asicModel.includes("(")) {
                            //had to add this for inconsistant post with S9s with th like (13.5Th/s)
                            //and had to fix how the date was pulled. Still might have to add another
                            //statement for when just Th/s is used
                            var date_1 = minerData
                                .match(/(?<=#usa [|]\s+).*?(?=\s+Miners)/gs)[0]
                                //removes the invalid chars
                                .replace(/[^\x20-\x7E]/g, "")
                                .split(" ")
                                .map(function (day) { return (day.includes(",") ? day.slice(0, -3) : day); })
                                .join(" ");
                            date_1 = (0, moment_1["default"])(new Date(date_1)).format("MM-DD-YYYY");
                            var th = Number(asicModel
                                .split(" ")
                                .filter(function (e) { return e.includes("("); })[0]
                                .replace("(", ""));
                            var asicName = asicModel
                                .match(/(?=Antminer S\s*).*?(?=\s*T)/gs)[0]
                                .replace("(", "");
                            var watts = asicWattList_1.asicWattList[asicSearchName][th] !== undefined
                                ? asicWattList_1.asicWattList[asicSearchName][th]
                                : asicWattList_1.asicWattList[asicSearchName]["wt"] * Number(th);
                            var efficiency = watts / th;
                            var model = "".concat(asicName, "T");
                            var id = vendor + model + price + date_1;
                            asics_1.push({
                                vendor: vendor,
                                model: model,
                                th: th,
                                watts: watts,
                                efficiency: efficiency,
                                price: price,
                                date: date_1,
                                id: (0, helpers_1.sha1)(id)
                            });
                        }
                    }
                    if (minerData.includes("Whatsminer M") &&
                        individualSales != null &&
                        moqTest[0] === 1) {
                        var vendor = "Kaboomracks";
                        var price = Number(minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)[0]);
                        var date = minerData
                            .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
                            .replace(/[^\x20-\x7E]/g, "")
                            .split(" ")
                            .map(function (day) { return (day.includes(",") ? day.slice(0, -3) : day); })
                            .join(" ");
                        date = (0, moment_1["default"])(new Date(date)).format("MM-DD-YYYY");
                        var asicModel = minerData.match(/(?=Whatsminer M\s*).*?(?=\s*for)/gs)[0];
                        var asicSearchName = minerData
                            .match(/(?=Whatsminer M\s*).*?(?=\s*T)/gs)[0]
                            .split(" ")
                            .slice(0, -1)
                            .join(" ");
                        var th = Number(asicModel
                            .split(" ")
                            .filter(function (e) {
                            return e.includes("T") && Number.isInteger(Number(e[0])) ? e[0] : null;
                        })[0]
                            .replace("T", ""));
                        var asicName = asicModel.match(/(?=Whatsminer M\s*).*?(?=\s*T)/gs);
                        var watts = asicWattList_1.asicWattList[asicSearchName][th] !== undefined
                            ? asicWattList_1.asicWattList[asicSearchName][th]
                            : asicWattList_1.asicWattList[asicSearchName]["wt"] * Number(th);
                        var efficiency = watts / th;
                        var model = "".concat(asicName[0], "T");
                        var id = vendor + model + price + date;
                        asics_1.push({
                            vendor: vendor,
                            model: model,
                            th: th,
                            watts: watts,
                            efficiency: efficiency,
                            price: price,
                            date: date,
                            id: (0, helpers_1.sha1)(id)
                        });
                    }
                    if (minerData.includes("Canaan A") &&
                        individualSales != null &&
                        moqTest[0] === 1) {
                        var vendor = "Kaboomracks";
                        var price = Number(minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)[0]);
                        var date = (0, moment_1["default"])(new Date(minerData
                            .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
                            .replace(/[^\x20-\x7E]/g, "")
                            .split(" ")
                            .map(function (day) { return (day.includes(",") ? day.slice(0, -3) : day); })
                            .join(" "))).isValid()
                            ? (0, moment_1["default"])(new Date(minerData
                                .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
                                .replace(/[^\x20-\x7E]/g, "")
                                .split(" ")
                                .map(function (day) { return (day.includes(",") ? day.slice(0, -3) : day); })
                                .join(" "))).format("MM-DD-YYYY")
                            : (0, moment_1["default"])(new Date(minerData
                                .match(/(?<=usa\s+).*?(?=\s+Miners for)/gs)[0]
                                .replace(/[^\x20-\x7E]/g, "")
                                .replace("| ", "")
                                .split(" ")
                                .map(function (day) { return (day.includes(",") ? day.slice(0, -3) : day); })
                                .join(" "))).format("MM-DD-YYYY");
                        var asicModel = minerData === null || minerData === void 0 ? void 0 : minerData.match(/(?=Canaan A\s*).*?(?=\s*for)/gs)[0];
                        var asicSearchName = minerData
                            .match(/(?=Canaan A\s*).*?(?=\s*T)/gs)[0]
                            .split(" ")
                            .slice(0, -1)
                            .join(" ");
                        if (asicModel.includes("T")) {
                            var th = Number(asicModel
                                .split(" ")
                                .filter(function (e) {
                                return e.includes("T") && Number.isInteger(Number(e[0])) ? e[0] : null;
                            })[0]
                                .replace("T", ""));
                            var asicName = asicModel === null || asicModel === void 0 ? void 0 : asicModel.match(/(?=Canaan A\s*).*?(?=\s*T)/gs);
                            var watts = asicWattList_1.asicWattList[asicSearchName][th] !== undefined
                                ? asicWattList_1.asicWattList[asicSearchName][th]
                                : asicWattList_1.asicWattList[asicSearchName]["wt"] * Number(th);
                            var efficiency = watts / th;
                            var model = "".concat(asicName[0], "T");
                            var id = vendor + model + price + date;
                            asics_1.push({
                                vendor: vendor,
                                model: model,
                                th: th,
                                watts: watts,
                                efficiency: efficiency,
                                price: price,
                                date: date,
                                id: (0, helpers_1.sha1)(id)
                            });
                        }
                        else if (!asicModel.includes("T")) {
                            var th = Number((_a = minerData === null || minerData === void 0 ? void 0 : minerData.match(/(?=[ㄴ]\s*).*?(?=\s*Th\/s)/gs)[0]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
                            var asicName = minerData === null || minerData === void 0 ? void 0 : minerData.match(/(?=Canaan A\s*).*?(?=\s*for)/gs)[0];
                            var watts = asicWattList_1.asicWattList[asicName][th] !== undefined
                                ? asicWattList_1.asicWattList[asicName][th]
                                : asicWattList_1.asicWattList[asicName]["wt"] * Number(th);
                            var efficiency = watts / th;
                            var model = asicName;
                            var id = vendor + model + price + date;
                            asics_1.push({
                                vendor: vendor,
                                model: model,
                                th: th,
                                watts: watts,
                                efficiency: efficiency,
                                price: price,
                                date: date,
                                id: (0, helpers_1.sha1)(id)
                            });
                        }
                    }
                });
                ids_1 = asics_1.map(function (a) { return a.id; });
                filtered = asics_1.filter(function (_a, idx) {
                    var id = _a.id;
                    return !ids_1.includes(id, idx + 1);
                });
                return [2 /*return*/, filtered];
            case 2:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports["default"] = kaboomracksScraper;
