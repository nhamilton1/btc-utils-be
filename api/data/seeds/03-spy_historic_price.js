const spy_price = require('../json/spy_historic.json')

exports.spy_price = spy_price

exports.seed = function(knex) {
  return knex('spy_historical_price').insert(spy_price)
};
