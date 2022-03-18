import moment from "moment";
import { scrape } from "./crawler";
import { add, getLastRow } from "./historic-prices-model";
import {Request, Response, NextFunction} from "express";

export const scrapeDates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dateCheck = await getLastRow();
    let mostRecentDate = dateCheck[dateCheck.length - 1].date;
    let currDate = moment(new Date()).format("YYYY-MM-DD");
    if (mostRecentDate !== currDate) {
      const scrapingForUpdates = await scrape(mostRecentDate);
      if (!scrapingForUpdates) return next();
      await add(scrapingForUpdates);
      next();
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};
