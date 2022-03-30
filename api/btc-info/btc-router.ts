import express, { Request, Response, NextFunction } from "express";
import axios from "axios";

const router = express.Router();

const hashRateStats = "https://insights.braiins.com/api/v1.0/hash-rate-stats";
const btcPriceURL = "https://insights.braiins.com/api/v1.0/price-stats";
//had to make this router to avoid cors errors

router.get(
  "/hashrate",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(hashRateStats);
      res.status(200).json(response.data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/btc-price",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(btcPriceURL);
      res.status(200).json(response.data);
    } catch (err) {
      next(err);
    }
  }
);

export { router as btcRouter };
