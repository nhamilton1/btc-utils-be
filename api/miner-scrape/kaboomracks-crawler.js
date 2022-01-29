const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");

const sha1 = (x) => crypto.createHash("sha1").update(x, "utf8").digest("hex");

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
        let seller = "Kaboomracks";
        //this will find between the given strings, for exmample here:
        //will find between Bitmain Antminer S and for
        let asic = minerData.match(
          /(?=Bitmain Antminer S\s*).*?(?=\s*for)/gs
        )[0];
        let price = Number(minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)[0]);
        let date = minerData
          .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
          //removes the invalid chars
          .replace(/[^\x20-\x7E]/g, "");
        let id = seller + asic + price + date;

        asics.push({
          seller,
          asic,
          price,
          date,
          id: sha1(id),
        });
      }

      if (minerData.includes("Whatsminer M") && individualSales != null) {
        let seller = "Kaboomracks";
        let asic = minerData.match(/(?=Whatsminer M\s*).*?(?=\s*for)/gs)[0];
        let price = Number(minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)[0]);
        let date = minerData
          .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
          .replace(/[^\x20-\x7E]/g, "");
        let id = seller + asic + price + date;

        asics.push({
          seller,
          asic,
          price,
          date,
          id: sha1(id),
        });
      }

      if (minerData.includes("Canaan A") && individualSales != null) {
        let seller = "Kaboomracks";
        let asic = minerData.match(/(?=Canaan A\s*).*?(?=\s*for)/gs)[0];
        let price = Number(minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)[0]);
        let date = minerData
          .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
          .replace(/[^\x20-\x7E]/g, "");
        let id = seller + asic + price + date;

        asics.push({
          seller,
          asic,
          price,
          date,
          id: sha1(id),
        });
      }
    });

    //filters for dups
    const ids = asics.map((a) => a.id);
    const filtered = asics.filter(({ id }, idx) => !ids.includes(id, idx + 1));

    return filtered;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  kaboomracksScraper,
};
