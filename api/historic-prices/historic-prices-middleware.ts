import moment from "moment";
import { scrape } from "./crawler";
import { add, getLastRow } from "./historic-prices-model";

interface scrapingUpdatesInterface {
    date: string;
    btc_price: number;
    spy_price: number | null;
    gld_price: number | null;
}

export const scrapeDates = async (_req, _res, next): Promise<void> => {
  try {
    const dateCheck = await getLastRow();
    let mostRecentDate = dateCheck[dateCheck.length - 1].date;
    let currDate = moment(new Date()).format("YYYY-MM-DD");
    if (mostRecentDate !== currDate) {
      const scrapingForUpdates = await scrape(mostRecentDate);
      if(!scrapingForUpdates) return next()
      await add(scrapingForUpdates);
      next();
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};
