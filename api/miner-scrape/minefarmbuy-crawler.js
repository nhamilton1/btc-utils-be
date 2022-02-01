const puppeteer = require("puppeteer");
const { sha1 } = require("./helpers");
const moment = require("moment");

const minefarmbuyScraper = async () => {
  let browser;
  try {
    // adding slowMo: 20 fixes the bug where asics with just the hashrate
    // option would push hashrates that were not there
    browser = await puppeteer.launch({
      slowMo: 1,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto("https://minefarmbuy.com/product-category/btc-asics/", {
      waitUntil: "domcontentloaded",
    });

    //gets all the urls on the btc asic product list page
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

    const minefarmbuyData = [];

    //loops through all of the filtered links
    for (const uurl of uniqUrls.values()) {
      const url = uurl;
      await page.goto(`${url}`, { waitUntil: "domcontentloaded" });

      //checks for ddp and dap, which usually means MOQ of 100 or more from what i saw on mfb
      const incoterms = await page.$$eval("#incoterms > option", (node) =>
        node.map((th) => th.innerText)
      );

      //checks for efficiency dropdown when page first loads
      const efficiency = await page.$$eval("#efficiency > option", (node) =>
        node.map((th) => th.innerText)
      );

      const filteredEfficiency = efficiency.filter((t) => t.match(/J\/th/i));

      //$$evail on most because if it was undefined, it would crash
      //could move this down to the if statement and make it $eval
      //have to remember to remove the [0]
      const ifNoPriceFromAsicPrice = await page.$$eval(
        "div > div.summary.entry-summary > p > span > bdi",
        (el) => el.map((e) => e.innerText)
      );

      //checks for hashrate dropdown when page first loads
      const hashOption = await page.$$eval("#hashrate > option", (node) =>
        node.map((th) => th.innerText)
      );

      //filters values for only ths, no batches or option value
      const filterHashrateOptions = hashOption.filter((t) => {
        return t.match(/th/i) && parseInt(Number(t.charAt(0)));
      });

      //checks for OoS
      //had to include this, would crash if it could not find it
      // eslint-disable-next-line no-unused-vars
      const oos = await page.$$eval(
        "div > div.summary.entry-summary > form > p",
        (el) => el.map((e) => e.innerText)
      );

      //no incoterms dropdown and no efficiency dropdown
      if (incoterms.length === 0 && filteredEfficiency.length === 0) {
        //loops through the filtered options and sets the data
        for await (const hash of filterHashrateOptions.values()) {
          await page.select("select#hashrate", hash);

          const asicPrice = await page.$$eval(
            "div > div > form > div > div > div > span > span > bdi",
            (node) => node.map((price) => price.innerText)
          );

          const asicName = await page.$eval(
            "div > div.summary.entry-summary > div.product_meta > span.sku_wrapper > span",
            (el) => el.innerText
          );

          let id = `minefarmbuy ${asicName} ${
            asicPrice[0] === undefined
              ? Number(
                  ifNoPriceFromAsicPrice[0].replace("$", "").replace(",", "")
                )
              : Number(asicPrice[0].replace("$", "").replace(",", ""))
          }`;

          minefarmbuyData.push({
            seller: "minefarmbuy",
            asic: asicName,
            th: hash,
            price:
              asicPrice[0] === undefined
                ? Number(
                    ifNoPriceFromAsicPrice[0].replace("$", "").replace(",", "")
                  )
                : Number(asicPrice[0].replace("$", "").replace(",", "")),
            date: moment().format("MMMM Do YYYY"),
            id: sha1(id),
          });
        }
      } else if (filteredEfficiency.length > 0) {
        for await (const effic of filteredEfficiency.values()) {
          await page.select("select#efficiency", effic);

          const hashrateOptionForEff = await page.$$eval(
            "#hashrate > option",
            (node) => node.map((th) => th.innerText)
          );

          const efficiencyHashrateOpt = hashrateOptionForEff.filter((t) => {
            return t.match(/th/i) && parseInt(Number(t.charAt(0)));
          });

          for await (const th of efficiencyHashrateOpt.values()) {
            await page.select("select#hashrate", th);

            const asicPrice = await page.$$eval(
              "div > div > form > div > div > div > span > span > bdi",
              (node) => node.map((price) => price.innerText)
            );

            const asicName = await page.$eval(
              "div > div.summary.entry-summary > div.product_meta > span.sku_wrapper > span",
              (el) => el.innerText
            );

            let id = `minefarmbuy ${asicName} ${Number(
              asicPrice[0].replace("$", "").replace(",", "")
            )}`;

            minefarmbuyData.push({
              seller: "minefarmbuy",
              asic: asicName,
              th,
              price: Number(asicPrice[0].replace("$", "").replace(",", "")),
              date: moment().format("MMMM Do YYYY"),
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
    console.log(minefarmbuyData)
    return minefarmbuyData;
  } catch (err) {
    console.error("Could not create a browser instance => : ", err);
  }
};

minefarmbuyScraper()

module.exports = {
  minefarmbuyScraper,
};
