const { sha1 } = require("./helpers");
const moment = require("moment");

const scraperObject = {
  url: "https://minefarmbuy.com/product-category/btc-asics/",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url, { waitUntil: "domcontentloaded" });
    //gets all the urls on the btc asic product list page
    const urls = await page.$$eval(
      "#blog > div > div > div > div > article > div > ul > li > a ",
      (title) => title.map((url) => url.href)
    );

    //filters out anything that are not asics
    const filteredUrls = await urls.filter((word) => {
      return (
        word.includes("whatsminer-m") ||
        word.includes("antminer-s") ||
        word.includes("canaan-a")
      );
    });

    //removes dups from the url array
    const uniqUrls = [...new Set(filteredUrls)];

    // Loop through each of those links, open a new page instance and get the relevant data from them
    let pagePromise = async (link) => {
        let newPage = await browser.newPage();
        await newPage.goto(link, { waitUntil: "domcontentloaded" });
  
        let minefarmbuyData = [];
  
        //checks for ddp and dap, which usually means MOQ of 100 or more from what i saw on mfb
        const incoterms = await newPage.$$eval("#incoterms > option", (node) =>
          node.map((th) => th.innerText)
        );
  
        //checks for efficiency dropdown when newPage first loads
        const efficiency = await newPage.$$eval("#efficiency > option", (node) =>
          node.map((th) => th.innerText)
        );
  
        const filteredEfficiency = efficiency.filter((t) => t.match(/J\/th/i));
  
        const ifNoPriceFromAsicPrice = await newPage.$eval(
          "div > div.summary.entry-summary > p > span > bdi",
          (el) => el.innerText
        );
  
        //checks for hashrate dropdown when newPage first loads
        const hashOption = await newPage.$$eval("#hashrate > option", (node) =>
          node.map((th) => th.innerText)
        );
  
        //filters values for only ths, no batches or option value
        const filterHashrateOptions = await hashOption.filter((t) => {
          return t.match(/th/i) && parseInt(Number(t.charAt(0)));
        });
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
                ? Number(ifNoPriceFromAsicPrice.replace("$", "").replace(",", ""))
                : Number(asicPrice[0].replace("$", "").replace(",", ""))
            }`;
  
            return minefarmbuyData.push({
              seller: "minefarmbuy",
              asic: `${asicName}`,
              th: hash,
              price:
                asicPrice[0] === undefined
                  ? Number(
                      ifNoPriceFromAsicPrice.replace("$", "").replace(",", "")
                    )
                  : Number(asicPrice[0].replace("$", "").replace(",", "")),
              date: moment().format("MMMM Do YYYY"),
              id: sha1(id),
            });
          }
        }
    };

    for (let link in uniqUrls) {
      let currentPageData = await pagePromise(uniqUrls[link]);
      // scrapedData.push(currentPageData);
      console.log(currentPageData);
    }
  },
};

module.exports = scraperObject;
