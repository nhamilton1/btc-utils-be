exports.up = async (knex) => {
    await knex.schema.createTable("market_data", (table) => {
      table.string("id").unique();
      table.string("vendor");
      table.string("model");
      table.float("price");
      table.string("date");
    });
  };
  
  exports.down = async (knex) => {
    await knex.schema.dropTableIfExists("market_data");
  };
  