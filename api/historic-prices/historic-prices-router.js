const router = require('express').Router()
const HistoricPrice = require('./historic-prices-model')
const {scrapeDates} = require('./historic-prices-middleware')

router.get('/:date_string?', scrapeDates, async (req, res, next) => {
    const startDate = req.query.startDate
    const endDate = req.query.endDate
    try {
        const btc_historic = await HistoricPrice.sqlRawFindBetweenDates(startDate, endDate)
        res.json(btc_historic)
    } catch(err) {
        next(err)
    }
})

module.exports = router