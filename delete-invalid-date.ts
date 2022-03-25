import { knex } from "knex";
import { defaults } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

if (process.env.DATABASE_URL) {
  defaults.ssl = { rejectUnauthorized: false };
}

interface dbConfigInterface {
  client: string;
  connection: {
    database?: string;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    sslmode: string;
  };
  searchPath: string[];
}

const dbConfig: dbConfigInterface = {
  client: "pg",
  connection: {
    database: process.env.DBNAME,
    host: process.env.DB_HOST,
    port: parseInt(<string>process.env.DB_PORT, 10) || 5432,
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
