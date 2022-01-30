const puppeteer = require("puppeteer");

const minefarmbuyScraper = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false });
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
    for (let i = 0; i < uniqUrls.length; i++) {
      try {
        const url = uniqUrls[i];
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

        const ifNoPriceFromAsicPrice = await page.$eval(
          "div > div.summary.entry-summary > p > span > bdi",
          (el) => el.innerText
        );

        //no incoterms dropdown and no efficiency dropdown
        if (incoterms.length === 0 && filteredEfficiency.length === 0) {
          //checks for hashrate dropdown when page first loads
          const option = await page.$$eval("#hashrate > option", (node) =>
            node.map((th) => th.innerText)
          );

          //filters values for only ths, no batches or option value
          const filteredOptions = option.filter((t) => {
            return t.match(/th/i) && parseInt(Number(t.charAt(0)));
          });


          //loops through the filtered options and sets the data
          for (let i = 0; i < filteredOptions.length; i++) {
            await page.select("select#hashrate", filteredOptions[i]);
            const asicPrice = await page.$$eval(
              "div > div > form > div > div > div > span > span > bdi",
              (node) => node.map((price) => price.innerText)
            );

            const asicName = await page.$eval(
              "div > div.summary.entry-summary > h1",
              (el) => el.innerText
            );

            minefarmbuyData.push({
              seller: "minefarmbuy",
              asic: `${asicName} ${filteredOptions[i]}`,
              price:
                asicPrice[0] === undefined
                  ? ifNoPriceFromAsicPrice
                  : asicPrice[0],
            });
          }
        }

        // else if (filteredEfficiency.length > 0) {
        //   for (let i = 0; i < filteredEfficiency.length; i++) {
        //     await page.select("select#efficiency", filteredEfficiency[i]);

        //     const optionForEff = await page.$$eval(
        //       "#hashrate > option",
        //       (node) => node.map((th) => th.innerText)
        //     );

        //     const filteredOptionsForEff = optionForEff.filter((t) => {
        //       return t.match(/th/i) && parseInt(Number(t.charAt(0)));
        //     });

        //     for (let j = 0; j < filteredOptionsForEff.length; j++) {
        //       await page.select("select#hashrate", filteredOptionsForEff[j]);

        //       const asicPrice = await page.$$eval(
        //         "div > div > form > div > div > div > span > span > bdi",
        //         (node) => node.map((price) => price.innerText)
        //       );

        //       const asicName = await page.$eval(
        //         "div > div.summary.entry-summary > h1",
        //         (el) => el.innerText
        //       );

        //       minefarmbuyData.push({
        //         seller: "minefarmbuy",
        //         asic: `${asicName} ${filteredOptionsForEff[j]} ${filteredEfficiency[i]}`,
        //         price: asicPrice[0],
        //       });
        //     }

        //     //waits for clear button to appear, probably can be optimized
        //     //this is getting stuck going to just use page.reload of now
        //     // await page.waitForSelector('.reset_variations', {visible: true})
        //     // await page.click(".reset_variations");
        //     // await page.waitForSelector(".woocommerce-variation single_variation", { hidden:true });

        //     await page.reload({ waitUntil: "domcontentloaded" });
        //   }
        // }


      } catch (error) {
        console.error(error);
      }
    }

    await browser.close();
    console.log(minefarmbuyData);
    return minefarmbuyData;
  } catch (err) {
    console.error("Could not create a browser instance => : ", err);
  }
};

minefarmbuyScraper();

module.exports = {
  minefarmbuyScraper,
};
