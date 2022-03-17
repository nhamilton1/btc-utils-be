require("dotenv").config();
const {
  kaboomracksScraper,
} = require("./api/miner-scrape/kaboomracks-crawler");
const {
  minefarmbuyScraper,
} = require("./api/miner-scrape/minefarmbuy-crawler");
const knex = require("knex");
const pg = require("pg");

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = { rejectUnauthorized: false };
}

const dbConfig = {
  client: "pg",
  connection: {
    database: process.env.DBNAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    sslmode: "require",
  },
  searchPath: ["knex", "public"],
};

const db = knex(dbConfig);

const getAllIds = async () => {
  const asics = await db("market_data as market")
    .join("miner_data as miner", "miner.model", "market.model")
    .select(
      "market.id",
      "market.vendor",
      "market.price",
      "market.date",
      "market.model",
      "miner.th",
      "miner.watts",
      "miner.efficiency"
    );
  return asics;
};

const getMarketData = async () => {
  const marketData = await db("market_data").select(
    "id",
    "vendor",
    "model",
    "price",
    "date"
  );
  return marketData;
};

const addMarketData = async (item) => {
  const marketData = item.map((x) => ({
    id: x.id,
    vendor: x.vendor,
    model: x.model,
    price: x.price,
    date: x.date,
  }));
  const [newItemObject] = await db("market_data").insert(marketData, [
    "id",
    "vendor",
    "model",
    "price",
    "date",
  ]);
  return newItemObject;
};

const getMinerData = async () => {
  const minerData = await db("miner_data").select(
    "model",
    "th",
    "watts",
    "efficiency"
  );
  return minerData;
};

const addMinerData = async (item) => {
  const minerData = item.map((x) => ({
    model: x.model,
    th: x.th,
    watts: x.watts,
    efficiency: x.efficiency,
  }));
  const [newItemObject] = await db("miner_data").insert(minerData, [
    "model",
    "th",
    "watts",
    "efficiency",
  ]);
  return newItemObject;
};

const scheduler = async () => {
  console.time("time");
  try {
    const asic = await getAllIds();
    const marketInfo = await getMarketData();
    const minerInfo = await getMinerData();
    const scrapeForMFBData = await minefarmbuyScraper();
    const scrapeForKaboomData = await kaboomracksScraper();
    const allData = scrapeForMFBData.concat(scrapeForKaboomData);

    const minerInfoDupCheck = allData.filter(
      (scapeData) =>
        !minerInfo.find((allAsicData) => scapeData.model === allAsicData.model)
    );
    const marketInfoDupCheck = allData.filter(
      (scapeData) =>
        !marketInfo.find((allAsicData) => scapeData.id === allAsicData.id)
    );
    if (asic.length === 0) {
      const minerInfoFirstDupCheck = scrapeForMFBData.filter(
        (scapeData) =>
          !scrapeForKaboomData.find(
            (allAsicData) => scapeData.model === allAsicData.model
          )
      );
      const firstDataInput = minerInfoFirstDupCheck.concat(scrapeForKaboomData);
      await addMinerData(firstDataInput);
      await addMarketData(allData);
    }
    if (minerInfoDupCheck.length > 0) {
      await addMinerData(minerInfoDupCheck);
    }
    if (marketInfoDupCheck.length > 0) {
      await addMarketData(marketInfoDupCheck);
    } 
    await db.destroy();
  } catch (err) {
    console.error("error in scheduler file", err);
  }
  console.timeEnd("time");
  await db.destroy();
};

scheduler();
