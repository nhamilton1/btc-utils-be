const Asics = require("./asic-miners-model");
const { kaboomracksScraper } = require("./kaboomracks-crawler");
const { minefarmbuyScraper } = require("./minefarmbuy-crawler");

const asicData = async (req, res, next) => {
  try {
    const asic = await Asics.getAllIds();
    const scrapeForKaboomData = await kaboomracksScraper();
    const scrapeForMFBData = await minefarmbuyScraper();
    const dupCheck1 = scrapeForKaboomData.filter(
      (scapeData) =>
        !asic.find((allAsicData) => scapeData.id === allAsicData.id)
    );
    const dupCheck2 = scrapeForMFBData.filter(
      (scapeData) =>
        !asic.find((allAsicData) => scapeData.id === allAsicData.id)
    );

    if (asic.length === 0) {
      await Asics.add(scrapeForKaboomData);
      await Asics.add(scrapeForMFBData);
      next();
    } else if (dupCheck1.length > 0 && dupCheck2.length > 0) {
      await Asics.add(dupCheck1);
      await Asics.add(dupCheck2);
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
