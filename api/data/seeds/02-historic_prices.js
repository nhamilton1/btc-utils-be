const btc = require('../json/btc_historic.json')
const spy = require('../json/spy_historic.json')
const gld = require('../json/gld_historic.json')

// finds the missing weekend dates from the spy and gld seed and adds the btc date and a null price. 
btc.map(x => spy.map(s => s.spy_date).indexOf(x.btc_date)  === -1 ? spy.push({spy_date: x.btc_date, spy_price: null}) : "")
btc.map(x => gld.map(s => s.gld_date).indexOf(x.btc_date)  === -1 ? gld.push({gld_date: x.btc_date, gld_price: null}) : "")

let dates = btc.map(x => x.btc_date),
btc_prices = btc.map(x => x.btc_price),
spy_prices = spy.map(x => x.spy_price),
gld_prices = gld.map(x => x.gld_price)

const data = dates.map((date, idx) => {

  return {
    date,
    btc_price: btc_prices[idx],
    spy_price: spy_prices[idx],
    gld_price: gld_prices[idx]
  }
})

exports.data = data

exports.seed = async (knex) => {
  return await knex('historical_prices').insert(data)
};
