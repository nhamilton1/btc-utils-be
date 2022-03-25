import { scrapeDates } from "./historic-prices-middleware";
import { sqlRawFindBetweenDates } from "./historic-prices-model";
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get(
  "/:date_string?",
  scrapeDates,
  async (req: Request, res: Response, next: NextFunction) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    if (!startDate || !endDate) {
      res.status(404).json({ error: "Dataset not found" });
      return;
    }
    if (typeof startDate !== "string" || typeof endDate !== "string") {
      res.status(500).json({ error: "Invalid dataset" });
      return;
    }
    try {
      const btc_historic = await sqlRawFindBetweenDates(startDate, endDate);
      res.json(btc_historic);
    } catch (err) {
      next(err);
    }
  }
);

export { router as historicPriceRouter };
