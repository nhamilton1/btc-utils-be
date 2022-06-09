import express, { Request, Response, NextFunction } from "express";
import axios from "axios";

const router = express.Router();

interface blockchainInter {
  last_trade_price: number;
}

interface resultsInter {
  price: number
}

const hashRateStats = "https://insights.braiins.com/api/v1.0/hash-rate-stats";
// braiins btc price is broken, changing to a different one for now
// const btcPriceURL = "https://insights.braiins.com/api/v1.0/price-stats";
const blockchainPrice =
  "https://api.blockchain.com/v3/exchange/tickers/BTC-USD";
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
    const results: resultsInter[] = [];
    
    try {
      const resBlockchainPrice = await axios.get<blockchainInter>(
        blockchainPrice
      );

      results.push({
        price: resBlockchainPrice.data.last_trade_price,
      });

      res.status(200).json(results[0]);
    } catch (err) {
      next(err);
    }
  }
);

export { router as btcRouter };
