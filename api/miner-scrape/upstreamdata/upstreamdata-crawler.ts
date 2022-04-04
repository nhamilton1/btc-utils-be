import moment from "moment"
import Puppeteer from "puppeteer"

interface removeImgEtcInterface {
    resourceType: () => string;
    abort: () => void;
    continue: () => void;
  }

const upStreamDataCrawler = async () => {
    let browser;
    try {
        browser = await Puppeteer.launch({
            slowMo: 5,
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
        const urls = await page.$$eval(
            "#main > ul > li > a:first-child",
            (title: { href: string }[]): string[] =>
              title.map((url: { href: string }): string => url.href)
          );
          

        console.log(urls);
    } catch (err) {
        console.log(err)
    }


}
upStreamDataCrawler()

export default upStreamDataCrawler;