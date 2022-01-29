const Asics = require("./asic-miners-model");
const { kaboomracksScraper } = require("./kaboomracks-crawler");

const asicData = async (req, res, next) => {
  try {
    const kaboom = await Asics.getAllIds();
    const scrapeForData = await kaboomracksScraper();
    const dupCheck = scrapeForData.filter(
      (scapeData) =>
        !kaboom.find((kaboomData) => scapeData.id === kaboomData.id)
    );

    if (kaboom.length === 0) {
      await Asics.add(scrapeForData);
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
