"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrape = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const moment_1 = __importDefault(require("moment"));
const scrape = async (mostRecentDate) => {
    try {
        mostRecentDate = (0, moment_1.default)(mostRecentDate).format("MMM DD YYYY");
        const { data: dataBtc } = await axios_1.default.get("https://finance.yahoo.com/quote/BTC-USD/history/");
        const { data: dataSpy } = await axios_1.default.get("https://finance.yahoo.com/quote/SPY/history/");
        const { data: dataGld } = await axios_1.default.get("https://finance.yahoo.com/quote/GLD/history/");
        const $btc = (0, cheerio_1.load)(dataBtc);
        const $spy = (0, cheerio_1.load)(dataSpy);
        const $gld = (0, cheerio_1.load)(dataGld);
        let btcData = [];
        let spyData = [];
        let gldData = [];
        //$ is scraping the web page
        $btc("#Col1-1-HistoricalDataTable-Proxy > section > div > table > tbody > tr> td:nth-child(1)").each((_idx, el) => {
            let btcDate = $btc(el).text();
            let btcPrice = $btc(el).next().next().next().next().next().text();
            if (new Date(btcDate).getTime() / 1000 >
                new Date(mostRecentDate).getTime() / 1000) {
                btcData.push({
                    btc_date: btcDate,
                    btc_price: parseFloat(btcPrice.replace(/,/g, "")),
                });
            }
        });
        $spy("#Col1-1-HistoricalDataTable-Proxy > section > div > table > tbody > tr > td:nth-child(1)").each((_idx, el) => {
            let dateChecker = [];
            let spyDate = $spy(el).text();
            let spyPrice = $spy(el).next().next().next().next().next().text();
            //checks for the dividend dupe date
            dateChecker.push(spyDate);
            if (new Date(spyDate).getTime() / 1000 >
                new Date(mostRecentDate).getTime() / 1000) {
                dateChecker.map((x) => spyData.map((s) => s.spy_date).indexOf(x) === -1
                    ? spyData.push({
                        spy_date: spyDate,
                        spy_price: spyPrice !== null ? parseFloat(spyPrice) : spyPrice,
                    })
                    : "");
            }
        });
        $gld("#Col1-1-HistoricalDataTable-Proxy > section > div > table > tbody > tr > td:nth-child(1)").each((_idx, el) => {
            let gldDate = $gld(el).text();
            let gldPrice = $gld(el).next().next().next().next().next().text();
            if (new Date(gldDate).getTime() / 1000 >
                new Date(mostRecentDate).getTime() / 1000) {
                gldData.push({
                    gld_date: gldDate,
                    gld_price: gldPrice !== null ? parseFloat(gldPrice) : gldPrice,
                });
            }
        });
        let formattedSpy = [];
        let formattedGld = [];
        //sets the missing dates, weekends/holidays, to null
        btcData.map((x) => spyData.map((s) => s.spy_date).indexOf(x.btc_date) === -1
            ? formattedSpy.push({ spy_date: x.btc_date, spy_price: null })
            : "");
        btcData.map((x) => gldData.map((s) => s.gld_date).indexOf(x.btc_date) === -1
            ? formattedGld.push({ gld_date: x.btc_date, gld_price: null })
            : "");
        //pushing already found dates into array
        spyData.map((x) => formattedSpy.push({ spy_date: x.spy_date, spy_price: x.spy_price }));
        gldData.map((x) => formattedGld.push({ gld_date: x.gld_date, gld_price: x.gld_price }));
        // sorts order by date
        formattedSpy.sort((a, b) => new Date(b.spy_date) - new Date(a.spy_date));
        formattedGld.sort((a, b) => new Date(b.gld_date) - new Date(a.gld_date));
        //formats data found to obj
        const data = btcData.map((date, idx) => {
            return {
                date: (0, moment_1.default)(new Date(btcData[idx].btc_date)).format("YYYY-MM-DD"),
                btc_price: btcData[idx].btc_price,
                spy_price: formattedSpy[idx].spy_price,
                gld_price: formattedGld[idx].gld_price,
            };
        });
        //sorts data by date
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        return data;
    }
    catch (err) {
        console.error(err);
    }
};
exports.scrape = scrape;
