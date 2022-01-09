const Dates = require('./historic-prices-model')
const moment = require('moment')
const { scrape } = require('./crawler')

const scrapeDates = async (req, res, next) => {
    const startDate = req.query.startDate
    const endDate = req.query.endDate
    try {
        const dateCheck = await Dates.findBetweenDates(startDate, endDate)
        let mostRecentDate = dateCheck[dateCheck.length -1].date
        let currDate = moment(new Date()).format('YYYY-MM-DD')
        if (mostRecentDate !== currDate){
            const sp = await scrape(mostRecentDate)
            console.log(sp)
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