import moment from "moment";
import Puppeteer from "puppeteer";
import { sha1 } from "../helpers";

interface removeImgEtcInterface {
  resourceType: () => string;
  abort: () => void;
  continue: () => void;
}

interface upstreamdataInterface {
  vendor: string;
  model: string;
  th: number;
  efficiency: number;
  watts: number;
  price: number;
  date: Date;
  id: string;
}

const upStreamDataCrawler = async () => {
  let browser;
  try {
    browser = await Puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setRequestInterception(true);

    page.on("request", (req: removeImgEtcInterface): void => {
      if (
        req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto("https://shop.upstreamdata.ca/product-category/asics/", {
      waitUntil: "domcontentloaded",
    });

    //gets all the urls on the btc asic product list page
    let urls = await page.$$eval(
      "#main > ul > li > a:first-child",
      (title: { href: string }[]): string[] =>
        title.map((url: { href: string }): string => url.href)
    );

    // remove any url that contains the word or "bundle"
    // will handle bundles at a later time
    urls = urls.filter((url: string) => !url.includes("bundle"));


    const upstreamdataAsics: upstreamdataInterface[] = [];

    for (const url of urls) {
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // .slice(0, -3) removes the h/s from the title
      let asicModel: string = await page.$eval(
        "div > div.summary.entry-summary > h1",
        (el: { innerText: string }): string => el.innerText
      );

      //puts a space between S19j and Pro
      if (asicModel.includes("S19jPro")) {
        asicModel = asicModel.replace("S19jPro", "S19j Pro");
      }

      // .replace(/[^\d.-]/g, '') removes all the non-numbers from the efficiency
      const efficiency: number = await page.$eval(
        "#tab-description > p:nth-child(4)",
        (el: { innerText: string }): number =>
          Number(el.innerText.replace(/[^\d.-]/g, ""))
      );

      const watts: number = await page.$eval(
        "#tab-description > p:nth-child(3)",
        (el: { innerText: string }): number =>
          Number(el.innerText.replace(/[^\d.-]/g, ""))
      );

      const price: number = await page.$eval(
        "div > div.summary.entry-summary > p.price > span > bdi",
        (el: { innerText: string }): number =>
          Number(el.innerText.replace(/[^\d.-]/g, ""))
      );

      const vendor: string = "upstreamdata";

      const date: Date = new Date(moment().format("MM-DD-YYYY"));

      const th: number = Number(
        asicModel.includes("h/s")
          ? asicModel.replace(/Th\/s/i, "").split(" ").pop()
          : asicModel.replace(/th/i, "").split(" ").pop()
      );

     asicModel = asicModel.includes("h/s")
      ? asicModel.replace(/Th\/s/i, "T")
      : asicModel.replace(/th/i, "T")

      const id = sha1(`upstreamdata ${asicModel} ${price}`);

      upstreamdataAsics.push({
        vendor,
        model: asicModel,
        th,
        watts,
        efficiency,
        price,
        date,
        id,
      });
    }
    await browser.close();
    return upstreamdataAsics;
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
};


export default upStreamDataCrawler;
