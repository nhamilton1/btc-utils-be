exports.up = function (knex) {
    return knex.schema
      .createTable('historical_prices', function (table) {
        table.string('date', 10).unique()
        table.float('btc_price')
        table.float('gld_price')
        table.float('spy_price')
      });
  };
  
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('historical_prices');
};
