const router = require("express").Router();
const Asics = require("./asic-miners-model");
const { asicData, firstLoad } = require('./asic-miners-middleware')

router.get("/", async (req, res, next) => {
  try {
    const asicMiners = await Asics.getAll();
    res.json(asicMiners);
  } catch (err) {
    next(err);
  }
});

router.get("/asics-scheduler", firstLoad, asicData, async (req, res, next) => {
  try {
    const asicMiners = await Asics.getAll();
    res.json(asicMiners);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
