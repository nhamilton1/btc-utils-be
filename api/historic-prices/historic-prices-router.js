const router = require('express').Router()
const HistoricPrice = require('./historic-prices-model')

router.get('/:date_string?', async (req, res, next) => {
    const startDate = req.query.startDate
    const endDate = req.query.endDate
    try {
        const btc_historic = await HistoricPrice.findBetweenDates(startDate, endDate)
        res.json(btc_historic)
    } catch(err) {
        next(err)
    }
})

module.exports = router