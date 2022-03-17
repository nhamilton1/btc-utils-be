const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const historicPriceRouter = require("./historic-prices/historic-prices-router");
const asicRouter = require('./miner-scrape/asic-miners-router');
const { normalDistRouter } = require("./normalDist/normalDistRouter");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use("/api/nd", normalDistRouter);
server.use("/api/historic_prices", historicPriceRouter);
server.use("/api/asics", asicRouter);


server.use((err, req, res, next) => {// eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
