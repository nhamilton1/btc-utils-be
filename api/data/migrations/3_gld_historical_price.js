exports.up = function (knex) {
    return knex.schema
      .createTable('gld_historical_price', function (table) {
        table.string('gld_date', 10).unique()
        table.float('gld_price')
      });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('gld_historical_price');
  };
  