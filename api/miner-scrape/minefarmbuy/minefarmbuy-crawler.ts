import moment from "moment";
import Puppeteer from "puppeteer";
import { sha1, convertPowerDraw, convertEfficiency } from "../helpers";

export interface minefarmbuyDataInterface {
  vendor: string;
  model: string;
  th: number;
  watts: number;
  efficiency: number;
  price: number;
  date: Date | string;
  id: string;
}

interface removeImgEtcInterface {
  resourceType: () => string;
  abort: () => void;
  continue: () => void;
}

interface InnerTextInterface {
  innerText: string;
}

const minefarmbuyScraper = async () => {
  let browser;
  try {
    // adding slowMo: 5 fixes the bug where asics with just the hashrate
    // option would push hashrates that were not there
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
    await page.goto("https://minefarmbuy.com/product-category/btc-asics/", {
      waitUntil: "domcontentloaded",
    });

    //gets all the urls on the btc asic product list page
    const urls = await page.$$eval(
      "#blog > div > div > div > div > article > div > ul > li > a ",
      (title: { href: string }[]): string[] =>
        title.map((url: { href: string }): string => url.href)
    );

    //filters out anything that are not asics
    const filteredUrls = urls.filter((word): string => {
      return (
        word.includes("whatsminer-m") ||
        word.includes("antminer-s") ||
        word.includes("canaan-a")
      );
    });

    //removes dups from the url array
    const uniqUrls = [...new Set(filteredUrls)];

    const minefarmbuyData: minefarmbuyDataInterface[] = [];

    // loops through all of the filtered links
    for (const url of uniqUrls.values()) {
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const asicModel = await page.$eval(
        "div > div.summary.entry-summary > h1",
        (el: InnerTextInterface): string => el.innerText
      );

      //checks for ddp and dap, which usually means MOQ of 100 or more from what i saw on mfb
      const incoterms = await page.$$eval(
        "#incoterms > option",
        (node: InnerTextInterface[]) =>
          node.map((th: InnerTextInterface) => th.innerText)
      );

      //checks for efficiency dropdown when page first loads
      const effici = await page.$$eval(
        "#efficiency > option",
        (node: InnerTextInterface[]) =>
          node.map((th: InnerTextInterface) => th.innerText)
      );

      const filteredEfficiency = effici.filter((t: string) =>
        t.match(/J\/th/i)
      );

      //$$evail on most because if it was undefined, it would crash
      //could move this down to the if statement and make it $eval
      //have to remember to remove the [0]
      const ifNoPriceFromAsicPrice = await page.$$eval(
        "div > div.summary.entry-summary > p > span > bdi",
        (el: InnerTextInterface[]) =>
          el.map((e: InnerTextInterface) => e.innerText)
      );

      //checks for OoS
      //had to include this, would crash if it could not find it
      // eslint-disable-next-line no-unused-vars
      const oos = await page.$$eval(
        "div > div.summary.entry-summary > form > p",
        (el: InnerTextInterface[]) =>
          el.map((e: InnerTextInterface) => e.innerText)
      );

      //no incoterms dropdown and no efficiency dropdown
      if (incoterms.length === 0 && filteredEfficiency.length === 0) {
        //checks for hashrate dropdown when page first loads
        const hashOption = await page.$$eval(
          "#hashrate > option",
          (node: InnerTextInterface[]) =>
            node.map((th: InnerTextInterface) => th.innerText)
        );

        //filters values for only ths, no batches or option value
        const filterHashrateOptions = hashOption.filter((t: string) => {
          return t.match(/th/i) && parseInt(t.charAt(0));
        });

        //loops through the filtered options and sets the data
        for (const th of filterHashrateOptions.values()) {
          await page.select("select#hashrate", th);

          const asicPrice = await page.$$eval(
            "div > div > form > div > div > div > span > span > bdi",
            (node: InnerTextInterface[]) =>
              node.map((price: InnerTextInterface) => price.innerText)
          );

          const powerDraw = await page.$eval(
            "#tab-additional_information > table > tbody > tr.woocommerce-product-attributes-item.woocommerce-product-attributes-item--attribute_power-draw > td",
            (el: InnerTextInterface) => el.innerText
          );

          // having this filter so the regex knows where to stop
          // the replace removes the first space if they leave a space
          // between the ++ like in M30s ++ should be M30s++
          const asicNameFilter = `${asicModel.replace(/\s+(\W)/g, "$1")} abc`;
          const asicName: RegExpMatchArray | null =
            asicNameFilter.match(/(?=Whatsminer\s*).*?(?=\s*abc)/gs) ||
            asicNameFilter.match(/(?=Antminer\s*).*?(?=\s*abc)/gs) ||
            asicNameFilter.match(/(?=Canaan\s*).*?(?=\s*abc)/gs);

          const model = `${asicName![0]} ${Number(th.split(/th/i)[0])}T`;

          //creating a unique id so later i can use it to check already found miners
          let id = `minefarmbuy ${model} ${
            asicPrice[0] === undefined
              ? Number(
                  ifNoPriceFromAsicPrice[0].replace("$", "").replace(",", "")
                )
              : Number(asicPrice[0].replace("$", "").replace(",", ""))
          }`;

          minefarmbuyData.push({
            vendor: "minefarmbuy",
            model,
            th: Number(th.split(/th/i)[0]),
            watts: convertPowerDraw(powerDraw, th),
            efficiency: convertEfficiency(powerDraw, th),
            price:
              asicPrice[0] === undefined
                ? Number(
                    ifNoPriceFromAsicPrice[0].replace("$", "").replace(",", "")
                  )
                : Number(asicPrice[0].replace("$", "").replace(",", "")),
            date: moment(new Date()).format("MM-DD-YYYY"),
            id: sha1(id),
          });
        }
      } else if (filteredEfficiency.length > 0) {
        for (const effic of filteredEfficiency.values()) {
          await page.select("select#efficiency", effic);

          const hashrateOptionForEff = await page.$$eval(
            "#hashrate > option",
            (node: InnerTextInterface[]) =>
              node.map((th: InnerTextInterface) => th.innerText)
          );

          const efficiencyHashrateOpt = hashrateOptionForEff.filter(
            (t: string) => {
              return t.match(/th/i) && parseInt(t.charAt(0));
            }
          );

          for (const th of efficiencyHashrateOpt.values()) {
            await page.select("select#hashrate", th);

            let asicPrice = await page.$$eval(
              "div > div > form > div > div > div > span > span > bdi",
              (node: InnerTextInterface[]) =>
                node.map((price: InnerTextInterface) => price.innerText)
            );

            if (asicPrice.length === 0) {
              asicPrice = await page.$$eval(
                "div > div.summary.entry-summary > p > span > bdi",
                (node: InnerTextInterface[]) =>
                  node.map((price: InnerTextInterface) => price.innerText)
              );
            }

            const model = `${asicModel} ${th.split(/th/i)[0]}T ${
              effic.split(/j\/th/i)[0]
            }J/th`;

            let id = `minefarmbuy ${model} ${Number(
              asicPrice[0].replace("$", "").replace(",", "")
            )}`;

            minefarmbuyData.push({
              vendor: "minefarmbuy",
              model,
              th: Number(th.split(/th/i)[0]),
              watts: convertPowerDraw(effic, th),
              efficiency: Number(effic.split(/j\/th/i)[0]),
              price: Number(asicPrice[0].replace("$", "").replace(",", "")),
              date: moment(new Date()).format("MM-DD-YYYY"),
              id: sha1(id),
            });
          }
          //puts choose an option back on both to reset selection, was having issues
          //where it would stick to previous value.
          await page.select("select#efficiency", "Choose an option");
          await page.select("select#hashrate", "Choose an option");
        }
      } else {
        break;
      }
    }

    await browser.close();
    return minefarmbuyData;
  } catch (err) {
    console.error("Could not create a browser instance => : ", err);
  }
};

export default minefarmbuyScraper;
