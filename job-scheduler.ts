import { defaults } from "pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import minefarmbuyScraper from "./api/miner-scrape/minefarmbuy/minefarmbuy-crawler";
import kaboomracksScraper from "./api/miner-scrape/kaboomracks/kaboomracks-crawler";
import upStreamDataCrawler from "./api/miner-scrape/upstreamdata/upstreamdata-crawler";
import {
  addMinerData,
  getMinerData,
} from "./api/miner-scrape/models/miner-data-model";
import {
  addMarketData,
  getMarketData,
} from "./api/miner-scrape/models/market-data-model";

dotenv.config();

if (process.env.DATABASE_URL) {
  defaults.ssl = { rejectUnauthorized: false };
}

const prisma = new PrismaClient();

const scheduler = async () => {
  console.time("time");
  try {
    const minerInfo = await getMinerData();
    const marketInfo = await getMarketData();
    const scrapeForMFBData = await minefarmbuyScraper();
    const scrapeForUpstreamData = await upStreamDataCrawler();
    const scrapeForKaboomData = await kaboomracksScraper();
    const allData = scrapeForMFBData?.concat(
      scrapeForKaboomData!,
      scrapeForUpstreamData!
    );

    const minerInfoDupCheck = allData?.filter(
      (scapeData) =>
        !minerInfo.find((allAsicData) => scapeData.model === allAsicData.model)
    );

    const marketInfoDupCheck = allData?.filter(
      (scapeData) =>
        !marketInfo.find((allAsicData) => scapeData.id === allAsicData.id)
    );

    if (minerInfoDupCheck!.length > 0) {
      const minerInfo = minerInfoDupCheck?.map((x) => ({
        model: x.model,
        th: x.th,
        watts: x.watts,
        efficiency: x.efficiency,
      }));
      console.log(minerInfo);
      await addMinerData(minerInfo!);
    }

    if (marketInfoDupCheck!.length > 0) {
      const marketInfo = marketInfoDupCheck?.map((x) => ({
        id: x.id,
        vendor: x.vendor,
        model: x.model,
        price: x.price,
        date: x.date,
      }));
      console.log(marketInfo);
      await addMarketData(marketInfo!);
    }
  } catch (err) {
    console.error("error in scheduler file", err);
  }
  console.timeEnd("time");
};

scheduler()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
