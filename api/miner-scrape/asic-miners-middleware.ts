import { Request, Response, NextFunction } from "express";
import kaboomracksScraper from "./kaboomracks/kaboomracks-crawler";
import minefarmbuyScraper from "./minefarmbuy/minefarmbuy-crawler";
import { addMarketData, getMarketData } from "./models/market-data-model";
import { addMinerData, getMinerData } from "./models/miner-data-model";
import upStreamDataCrawler from "./upstreamdata/upstreamdata-crawler";

const asicData = async (req: Request, res: Response, next: NextFunction) => {
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
      await addMarketData(marketInfo!);
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default asicData;
