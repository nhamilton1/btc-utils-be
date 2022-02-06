exports.up = async (knex) => {
  await knex.schema.createTable("miner_data", (table) => {
    table.string("model");
    table.float("th");
    table.float("watts");
    table.float("efficiency");
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("miner_data");
};
