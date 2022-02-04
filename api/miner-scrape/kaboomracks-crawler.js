const axios = require("axios");
const cheerio = require("cheerio");
const { sha1 } = require("./helpers");
const asicWattList = require("./asicWattList");

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
      const moq = minerData.match(/(?=order \s*).*?(?=\s*ships)/g);

      //tests for moq of 1
      const moqTest = moq?.map((ele) =>
        ele
          .split(" ")
          .map((n) => (!isNaN(n) ? Number(n) : null))
          .filter((i) => i)
      )[0];

      if (
        //might have to change this so it includes T versions
        minerData.includes("Antminer S") &&
        individualSales != null &&
        moqTest[0] === 1
      ) {
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

        let th = Number(
          asic
            .split(" ")
            .filter((e) =>
              e.includes("T") && Number.isInteger(Number(e[0])) ? e[0] : null
            )[0]
            .replace("T", "")
        );

        //gets the asic name without the th
        let asicSearchName = minerData
          .match(/(?=Bitmain Antminer S\s*).*?(?=\s*T)/gs)[0]
          .split(" ")
          .slice(0, -1)
          .join(" ");

        //gets the watts from the asic watt list, remove the t from the th var
        //if there isnt a match it will take the wt and * it by the th
        let watts =
          asicWattList[asicSearchName][th] !== undefined
            ? asicWattList[asicSearchName][th]
            : asicWattList[asicSearchName]["wt"] * Number(th);

        let efficiency = watts / th;

        asics.push({
          seller,
          asic,
          th,
          watts,
          efficiency,
          price,
          date,
          id: sha1(id),
        });
      }

      if (
        minerData.includes("Whatsminer M") &&
        individualSales != null &&
        moqTest[0] === 1
      ) {
        let seller = "Kaboomracks";
        let asic = minerData.match(/(?=Whatsminer M\s*).*?(?=\s*for)/gs)[0];
        let price = Number(minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)[0]);
        let date = minerData
          .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
          .replace(/[^\x20-\x7E]/g, "");
        let id = seller + asic + price + date;

        let th = Number(
          asic
            .split(" ")
            .filter((e) =>
              e.includes("T") && Number.isInteger(Number(e[0])) ? e[0] : null
            )[0]
            .replace("T", "")
        );

        let asicSearchName = minerData
          .match(/(?=Whatsminer M\s*).*?(?=\s*T)/gs)[0]
          .split(" ")
          .slice(0, -1)
          .join(" ");

        let watts =
          asicWattList[asicSearchName][th] !== undefined
            ? asicWattList[asicSearchName][th]
            : asicWattList[asicSearchName]["wt"] * Number(th);

        let efficiency = watts / th;

        asics.push({
          seller,
          asic,
          th,
          watts,
          efficiency,
          price,
          date,
          id: sha1(id),
        });
      }

      if (
        minerData.includes("Canaan A") &&
        individualSales != null &&
        moqTest[0] === 1
      ) {
        let seller = "Kaboomracks";
        let asic = minerData.match(/(?=Canaan A\s*).*?(?=\s*for)/gs)[0];
        let price = Number(minerData.match(/(?<=[$]\s*).*?(?=\s*each —)/gs)[0]);
        let date = minerData
          .match(/(?<=[|]\s+).*?(?=\s+Miners)/gs)[0]
          .replace(/[^\x20-\x7E]/g, "");
        let id = seller + asic + price + date;

        let th = Number(
          asic
            .split(" ")
            .filter((e) =>
              e.includes("T") && Number.isInteger(Number(e[0])) ? e[0] : null
            )[0]
            .replace("T", "")
        );

        let asicSearchName = minerData
          .match(/(?=Canaan A\s*).*?(?=\s*T)/gs)[0]
          .split(" ")
          .slice(0, -1)
          .join(" ");

        let watts =
          asicWattList[asicSearchName][th] !== undefined
            ? asicWattList[asicSearchName][th]
            : asicWattList[asicSearchName]["wt"] * Number(th);

        let efficiency = watts / th;

        asics.push({
          seller,
          asic,
          th,
          watts,
          efficiency,
          price,
          date,
          id: sha1(id),
        });
      }
    });

    //filters for dups
    const ids = asics.map((a) => a.id);
    const filtered = asics.filter(({ id }, idx) => !ids.includes(id, idx + 1));
    console.log(filtered);
    return filtered;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  kaboomracksScraper,
};
