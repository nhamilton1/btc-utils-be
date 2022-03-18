import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";

const historicPriceRouter = require("./historic-prices/historic-prices-router");
const asicRouter = require("./miner-scrape/asic-miners-router");
const { normalDistRouter } = require("./normalDist/normalDistRouter");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use("/api/nd", normalDistRouter);
server.use("/api/historic_prices", historicPriceRouter);
server.use("/api/asics", asicRouter);

server.use(
  (
    err: { status: Number; message: String; stack: String },
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return res.status((err.status as number) || 500).json({
      message: err.message,
      stack: err.stack,
    });
  }
);

export { server };
