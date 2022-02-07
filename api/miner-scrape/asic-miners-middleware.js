const Asics = require("./asic-miners-model");
const MarketData = require("./market-data-model");
const MinerData = require("./miner-data-model");
const { kaboomracksScraper } = require("./kaboomracks-crawler");
const { minefarmbuyScraper } = require("./minefarmbuy-crawler");
// this takes up too much memory for heroku and would have to pay to use it.
// took up mem=643M(125.7%), last test used mem=727M(141.4%)

const asicData = async (req, res, next) => {
  try {
    const asic = await Asics.getAllIds();
    const minerInfo = await MinerData.getMinerData();
    const marketInfo = await MarketData.getMarketData();
    const scrapeForMFBData = await minefarmbuyScraper();
    const scrapeForKaboomData = await kaboomracksScraper();
    const allData = scrapeForMFBData.concat(scrapeForKaboomData);

    const minerInfoDupCheck = allData.filter(
      (scapeData) =>
        !minerInfo.find((allAsicData) => scapeData.model === allAsicData.model)
    );

    const marketInfoDupCheck = allData.filter(
      (scapeData) =>
        !marketInfo.find((allAsicData) => scapeData.id === allAsicData.id)
    );

    if (asic.length === 0) {
      const minerInfoFirstDupCheck = scrapeForMFBData.filter(
        (scapeData) =>
          !scrapeForKaboomData.find(
            (allAsicData) => scapeData.model === allAsicData.model
          )
      );
      const firstDataInput = minerInfoFirstDupCheck.concat(scrapeForKaboomData);
      await MinerData.addMinerData(firstDataInput);
      await MarketData.addMarketData(allData);
      next();
    } else if (minerInfoDupCheck.length > 0) {
      await MinerData.addMinerData(minerInfoDupCheck);
      next();
    } else if (marketInfoDupCheck.length > 0) {
      await MarketData.addMarketData(marketInfoDupCheck);
      next();
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  asicData,
};
