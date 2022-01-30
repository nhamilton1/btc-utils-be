exports.up = async (knex) => {
  await knex.schema.createTable("asic_data", (table) => {
    table.string("id").unique();
    table.string("seller", 11);
    table.string("asic");
    table.string("th", 5);
    table.float("price");
    table.string("date");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("asic_data");
};
