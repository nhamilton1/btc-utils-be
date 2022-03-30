import asicData from "./asic-miners-middleware";
import { getAll } from "./models/asic-miners-model";
import * as express from "express";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const asicMiners = await getAll();
    res.json(asicMiners);
  } catch (err) {
    next(err);
  }
});

router.get("/asics-scheduler", asicData, async (_req, res, next) => {
  try {
    const asicMiners = await getAll();
    res.json(asicMiners);
  } catch (err) {
    next(err);
  }
});

export { router as asicRouter };
