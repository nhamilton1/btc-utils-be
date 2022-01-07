const btc_price = require('../json/btc_historic.json')

exports.btc_price = btc_price

exports.seed = function(knex) {
  return knex('btc_historical_price').insert(btc_price)
};
