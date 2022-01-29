exports.up = async (knex) => {
  await knex.schema.createTable("kaboomracks", (table) => {
    table.string("id").unique();
    table.string("seller");
    table.string("asic");
    table.float("price");
    table.string("date");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("kaboomracks");
};
