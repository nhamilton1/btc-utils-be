const db = require('../data/db-config')

const findAll = () => {
    return db('historical_prices')
}

const findBetweenDates = async (startDate, endDate) => {
    const dates = await db('historical_prices')
        .select('date', 'btc_price', 'gld_price', 'spy_price')
        .where('date', '>=', startDate)
        .where('date', '<', endDate)
        .orderBy('date', 'ASC')
    return dates

}

module.exports = {
    findAll,
    findBetweenDates
}