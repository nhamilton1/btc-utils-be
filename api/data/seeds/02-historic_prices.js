const btc_price = require('../json/btc_historic.json')
const spy_price = require('../json/spy_historic.json')
const gld_price = require('../json/gld_historic.json')


const dates = btc_price.map(x => x.btc_date),
btc_prices = btc_price.map(x => x.btc_price),
spy_prices = spy_price.map(x => x.spy_price),
gld_prices = gld_price.map(x => x.gld_price)

const data = dates.map((date, idx) => {
    return {
        date,
        btc_price: btc_prices[idx],
        spy_price: spy_prices[idx],
        gld_price: gld_prices[idx]
    }
})


exports.data = data

exports.seed = function(knex) {
  return knex('historical_prices').insert(data)
};
