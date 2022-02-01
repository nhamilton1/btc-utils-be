const Asics = require("./asic-miners-model");
const { kaboomracksScraper } = require("./kaboomracks-crawler");
const { mfbScraper } = require("./newMFB-crawler");

const asicData = async (req, res, next) => {
  try {
    const asic = await Asics.getAllIds();
    const scrapeForMFBData = await mfbScraper();
    const scrapeForKaboomData = await kaboomracksScraper();
    const allData = scrapeForMFBData.concat(scrapeForKaboomData);
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
