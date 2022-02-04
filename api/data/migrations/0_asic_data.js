exports.up = async (knex) => {
  await knex.schema.createTable("asic_data", (table) => {
    table.string("id").unique();
    table.string("seller");
    table.string("asic");
    table.string("th");
    table.float("watts");
    table.float("price");
    table.string("date");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("asic_data");
};
