const axios = require('axios');
const cheerio = require('cheerio');

async function scrape() {
    try {
        const { data } = await axios.get('https://finance.yahoo.com/quote/BTC-USD/history/')
        const $ = cheerio.load(data);
        const tableData = []

        $("#Col1-1-HistoricalDataTable-Proxy > section > div > table > tbody > tr> td:nth-child(1)").each((_idx, el) => {
            const btcDate = $(el).text()
            const btcPrice = $(el).next().next().next().next().next().text()
            tableData.push({ date: btcDate, btc_price: parseFloat(btcPrice.replace(/,/g, ''))})
        })
        
        return tableData
    } catch (err) {
        console.log(err)
    }
}

scrape().then((tableData) => console.log(tableData))

