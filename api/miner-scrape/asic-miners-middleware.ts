import { Request, Response, NextFunction } from "express";
import kaboomracksScraper from "./kaboomracks/kaboomracks-crawler";
import minefarmbuyScraper from "./minefarmbuy/minefarmbuy-crawler";
import { getAllIds } from "./models/asic-miners-model";
import { addMarketData, getMarketData } from "./models/market-data-model";
import { addMinerData, getMinerData } from "./models/miner-data-model";
import upStreamDataCrawler from "./upstreamdata/upstreamdata-crawler";

// this takes up too much memory for heroku and would have to pay to use it.
// took up mem=643M(125.7%), last test used mem=727M(141.4%)

const asicData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const asic = await getAllIds();
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

    if (asic.length === 0) {
      const minerInfoFirstDupCheck = scrapeForMFBData?.filter(
        (scapeData) =>
          !scrapeForKaboomData?.find(
            (allAsicData) => scapeData.model === allAsicData.model
          )
      );
      const firstDataInput = minerInfoFirstDupCheck?.concat(
        scrapeForKaboomData!
      );
      await addMinerData(firstDataInput!);
      await addMarketData(allData);
      next();
    }
    if (minerInfoDupCheck!.length > 0) {
      await addMinerData(minerInfoDupCheck!);
    }
    if (marketInfoDupCheck!.length > 0) {
      await addMarketData(marketInfoDupCheck);
    }
    next();
  } catch (err) {
    next(err);
  }
};

export default asicData;
