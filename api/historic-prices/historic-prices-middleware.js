const Dates = require('./historic-prices-model')
const moment = require('moment')
const { scrape } = require('./crawler')

const scrapeDates = async (req, res, next) => {
    try {
        const dateCheck = await Dates.getLastRow()
        let mostRecentDate = dateCheck[dateCheck.length -1].date
        let currDate = moment(new Date()).format('YYYY-MM-DD')
        if (mostRecentDate !== currDate){
            const scrapingForUpdates = await scrape(mostRecentDate)
            await Dates.add(scrapingForUpdates)
            next()
        } else {
            next()
        }

    } catch (err) {
        next(err)
    }
}

module.exports ={
    scrapeDates
}