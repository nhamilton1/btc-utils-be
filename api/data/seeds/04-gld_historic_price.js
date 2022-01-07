const gld_price = require('../json/gld_historic.json')

exports.gld_price = gld_price

exports.seed = function(knex) {
  return knex('gld_historical_price').insert(gld_price)
};
