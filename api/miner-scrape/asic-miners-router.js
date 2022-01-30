const router = require("express").Router();
const Asics = require("./asic-miners-model");
const { asicData } = require('./asic-miners-middleware')

router.get("/", asicData, async (req, res, next) => {
  try {
    const asicMiners = await Asics.getAll();
    res.json(asicMiners);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
