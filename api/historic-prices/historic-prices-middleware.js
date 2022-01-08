const Dates = require('./historic-prices-model')
const moment = require('moment')

const scrapeDates = async (req, res, next) => {
    const startDate = req.query.startDate
    const endDate = req.query.endDate
    try {
        const dateCheck = await Dates.findBetweenDates(startDate, endDate)
        let mostRecentDate = dateCheck[dateCheck.length -1].date
        let currDate = moment(new Date()).format('YYYY-MM-DD')
        if (mostRecentDate !== currDate){
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