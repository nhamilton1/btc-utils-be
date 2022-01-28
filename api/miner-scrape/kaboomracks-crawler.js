const axios = require("axios");
const cheerio = require("cheerio");

const kaboomracksScraper = async () => {
  try {
    const { data } = await axios.get("https://t.me/s/kaboomracks");

    const $miner = cheerio.load(data);

    const asics = [];
    $miner(
      "body > main > div > section > div > div > div > div.tgme_widget_message_text"
    ).each((_idx, el) => {
      let minerData = $miner(el).text();

      // this will filter out any posts that do not each in them
      // they sell by lots some times.
      const individualSales = minerData.match(/(?=[—]\s*).*?(?=\s*each —)/gs);

      if (minerData.includes("Antminer S") && individualSales != null) {
        asics.push({
          //this will find between the given strings, for exmample here:
          //will find between Bitmain Antminer S and for
          seller: 'Kaboomracks',
          asic: minerData.match(/(?=Bitmain Antminer S\s*).*?(?=\s*for)/gs)[0],
          price: Number(minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)[0]),
          date: minerData
            .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
            // this removes the the non ascii chars at the end
            .replace(/[^\x20-\x7E]/g, ""),
        });
      }

      if (minerData.includes("Whatsminer M") && individualSales != null) {
        asics.push({
          seller: 'Kaboomracks',
          asic: minerData.match(/(?=Whatsminer M\s*).*?(?=\s*for)/gs)[0],
          price: Number(minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)[0]),
          date: minerData
            .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
            .replace(/[^\x20-\x7E]/g, ""),
        });
      }

      if (minerData.includes("Canaan A") && individualSales != null) {
        asics.push({
          seller: 'Kaboomracks',
          asic: minerData.match(/(?=Canaan A\s*).*?(?=\s*for)/gs)[0],
          price: Number(minerData.match(/(?=[$]\s*).*?(?=\s*each —)/gs)[0]),
          date: minerData
            .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
            .replace(/[^\x20-\x7E]/g, ""),
        });
      }
    });

    return asics
  } catch (err) {
    console.error(err);
  }
};

kaboomracksScraper();
