import { scrape } from "./crawler";
import { add, getLastRow } from "./historic-prices-model";
import { Request, Response, NextFunction } from "express";
import moment from "moment";

export const scrapeDates = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dateCheck = await getLastRow();
    let mostRecentDate: Date = dateCheck[0].date;
    let currDate: Date = new Date(moment().format("MM-DD-YYYY"));
    if (new Date(mostRecentDate) !== currDate) {
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
