require("dotenv").config();
const knex = require("knex");
const pg = require("pg");

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = { rejectUnauthorized: false };
}

const dbConfig = {
  client: "pg",
  connection: {
    database: process.env.DBNAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    sslmode: "require",
  },
  searchPath: ["knex", "public"],
};

const db = knex(dbConfig);

const getInvalidDate = async () => {
  const asics = await db("market_data as market")
    .select("market.id", "market.date")
    .where('date','Invalid date')
    .del();
  return asics;
};

const deleteInvalidDate = async () => {
  console.time("time");
  try {
    const invalidDate = await getInvalidDate();
    console.log(invalidDate)
  } catch (err) {
    console.error(err);
  }

  console.timeEnd("time");
  await db.destroy();
};

deleteInvalidDate();
