const db = require('../data/db-config')

const findBetweenDates = async (startDate, endDate) => {
    const dates = await db('btc_historical_price as btc')
        .leftJoin('gld_historical_price as gld', 'gld.gld_date', 'btc.btc_date')
        .leftJoin('spy_historical_price as spy', 'spy.spy_date', 'btc.btc_date')
        .select('btc.btc_date', 'btc.btc_price', 'gld.gld_price', 'spy.spy_price')
        .where('btc.btc_date', '>=', startDate)
        .where('btc.btc_date', '<', endDate)
        .orderBy('btc_date', 'asc')
    return dates

}

module.exports = {
    findBetweenDates
}