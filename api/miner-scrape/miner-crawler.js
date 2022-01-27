const axios = require("axios");
const cheerio = require("cheerio");

const minerScraper = async () => {
  try {
    const { data } = await axios.get("https://t.me/s/kaboomracks");

    const $miner = cheerio.load(data);

    const asics = []
    $miner(
      "body > main > div > section > div > div > div > div.tgme_widget_message_text"
    ).each((_idx, el) => {
      const minerData = $miner(el).text()
      if(minerData.includes('Bitmain Antminer') || minerData.includes('Whatsminer') || minerData.includes('Canaan')){
        asics.push(minerData)
      }
    });

    let formattedAsics = asics.map(listings => listings.split('ㄴ').map(list => list.trim()))

    console.log(formattedAsics)

  } catch (err) {
    console.error(err);
  }
};

minerScraper();
