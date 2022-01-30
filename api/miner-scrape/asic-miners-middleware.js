const Asics = require("./asic-miners-model");
const { kaboomracksScraper } = require("./kaboomracks-crawler");
const { minefarmbuyScraper } = require("./minefarmbuy-crawler");

const asicData = async (req, res, next) => {
  try {
    const asic = await Asics.getAllIds();
    const scrapeForKaboomData = await kaboomracksScraper();
    const scrapeForMFBData = await minefarmbuyScraper();
    const allData = [...scrapeForKaboomData, ...scrapeForMFBData];
    const dupCheck = allData.filter(
      (scapeData) =>
        !asic.find((allAsicData) => scapeData.id === allAsicData.id)
    );

    if (asic.length === 0) {
      await Asics.add(allData);
      next();
    } else if (dupCheck.length > 0) {
      await Asics.add(dupCheck);
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
