exports.up = function (knex) {
    return knex.schema
      .createTable('btc_historical_price', function (table) {
        table.string('btc_date', 10).unique()
        table.float('btc_price')
      });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('btc_historical_price');
  };
  