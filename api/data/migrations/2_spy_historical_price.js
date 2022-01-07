exports.up = function (knex) {
    return knex.schema
      .createTable('spy_historical_price', function (table) {
        table.string('spy_date', 10).unique()
        table.float('spy_price')
      });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('spy_historical_price');
  };
  