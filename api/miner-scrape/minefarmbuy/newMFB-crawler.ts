import moment from "moment";
import { launch } from "puppeteer";
import { sha1, convertPowerDraw, convertEfficiency} from '../helpers'

interface minefarmbuyDataInterface {
  vendor: string
  model: string
  th: number
  watts: number,
  efficiency: number,
  price: number
  date: Date | string,
  id: string,
}

const mfbScraper = async () => {
  const withBrowser = async (fn) => {
    // adding slowMo: 5 fixes the bug where asics with just the hashrate
    // option would push hashrates that were not there
    const browser = await launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        '--js-flags="--max-old-space-size=500"',
      ],
    });
    try {
      return await fn(browser);
    } finally {
      await browser.close();
    }
  };

  const withPage = (browser) => async (fn) => {
    const page = await browser.newPage();
    try {
      return await fn(page);
    } finally {
      await page.close();
    }
  };

  //gets the urls from the product category page and sorts them
  const urls = await withBrowser(async (browser) => {
    return withPage(browser)(async (page) => {
      await page.goto("https://minefarmbuy.com/product-category/btc-asics/");
      const urls = await page.$$eval(
        "#blog > div > div > div > div > article > div > ul > li > a ",
        (title) => title.map((url) => url.href)
      );

      //filters out anything that are not asics
      const filteredUrls = urls.filter((word) => {
        return (
          word.includes("whatsminer-m") ||
          word.includes("antminer-s") ||
          word.includes("canaan-a")
        );
      });

      //removes dups from the url array
      const uniqUrls = [...new Set(filteredUrls)];
      return uniqUrls;
    });
  });

  const results = await withBrowser(async (browser) => {
    return Promise.all(
      urls.map(async (url) => {
        return withPage(browser)(async (page) => {
          await page.setViewport({ width: 1920, height: 1080 });
          await page.setRequestInterception(true);
          page.on("request", (req) => {
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
          let minefarmbuyData: minefarmbuyDataInterface[] = [];
          await page.goto(url, { waitUntil: "domcontentloaded" });

          const asicModel = await page.$eval(
            "div > div.summary.entry-summary > h1",
            (el) => el.innerText
          );

          //checks for ddp and dap, which usually means MOQ of 100 or more from what i saw on mfb
          const incoterms = await page.$$eval("#incoterms > option", (node) =>
            node.map((th) => th.innerText)
          );

          //checks for efficiency dropdown when page first loads
          const effici = await page.$$eval("#efficiency > option", (node) =>
            node.map((th) => th.innerText)
          );

          const filteredEfficiency = effici.filter((t) => t.match(/J\/th/i));

          //$$evail on most because if it was undefined, it would crash
          //could move this down to the if statement and make it $eval
          //have to remember to remove the [0]
          const ifNoPriceFromAsicPrice = await page.$$eval(
            "div > div.summary.entry-summary > p > span > bdi",
            (el) => el.map((e) => e.innerText)
          );

          //checks for OoS
          //had to include this, would crash if it could not find it
          // eslint-disable-next-line no-unused-vars
          const oos = await page.$$eval(
            "div > div.summary.entry-summary > form > p",
            (el) => el.map((e) => e.innerText)
          );

          //no incoterms dropdown and no efficiency dropdown
          if (incoterms.length === 0 && filteredEfficiency.length === 0) {
            //checks for hashrate dropdown when page first loads
            const hashOption = await page.$$eval("#hashrate > option", (node) =>
              node.map((th) => th.innerText)
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
                (node) => node.map((price) => price.innerText)
              );

              const powerDraw = await page.$eval(
                "#tab-additional_information > table > tbody > tr.woocommerce-product-attributes-item.woocommerce-product-attributes-item--attribute_power-draw > td",
                (el) => el.innerText
              );

              // having this filter so the regex knows where to stop
              // the replace removes the first space if they leave a space
              // between the ++ like in M30s ++ should be M30s++
              const asicNameFilter = `${asicModel.replace(
                /\s+(\W)/g,
                "$1"
              )} abc`;
              const asicName: RegExpMatchArray | null =
                asicNameFilter.match(/(?=Whatsminer\s*).*?(?=\s*abc)/gs) ||
                asicNameFilter.match(/(?=Antminer\s*).*?(?=\s*abc)/gs) ||
                asicNameFilter.match(/(?=Canaan\s*).*?(?=\s*abc)/gs);

              const model = `${asicName![0]} ${Number(th.split(/th/i)[0])}T`;

              //creating a unique id so later i can use it to check already found miners
              let id = `minefarmbuy ${model} ${
                asicPrice[0] === undefined
                  ? Number(
                      ifNoPriceFromAsicPrice[0]
                        .replace("$", "")
                        .replace(",", "")
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
                        ifNoPriceFromAsicPrice[0]
                          .replace("$", "")
                          .replace(",", "")
                      )
                    : Number(asicPrice[0].replace("$", "").replace(",", "")),
                date: moment().format("MM-DD-YYYY"),
                id: sha1(id),
              });
            }
          } else if (filteredEfficiency.length > 0) {
            for (const effic of filteredEfficiency.values()) {
              await page.select("select#efficiency", effic);

              const hashrateOptionForEff = await page.$$eval(
                "#hashrate > option",
                (node) => node.map((th) => th.innerText)
              );

              const efficiencyHashrateOpt = hashrateOptionForEff.filter((t) => {
                return t.match(/th/i) && parseInt(t.charAt(0));
              });

              for (const th of efficiencyHashrateOpt.values()) {
                await page.select("select#hashrate", th);

                const asicPrice = await page.$$eval(
                  "div > div > form > div > div > div > span > span > bdi",
                  (node) => node.map((price) => price.innerText)
                );

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
                  date: moment().format("MM-DD-YYYY"),
                  id: sha1(id),
                });
              }
              //puts choose an option back on both to reset selection, was having issues
              //where it would stick to previous value.
              await page.select("select#efficiency", "Choose an option");
              await page.select("select#hashrate", "Choose an option");
            }
          }
          return minefarmbuyData;
        });
      })
    );
  });

  results.filter((data) => data.length > 0);
  let flattened = [].concat(...results);
  return flattened;
};

module.exports = {
  mfbScraper,
};
