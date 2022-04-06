-- CreateTable
CREATE TABLE "historical_prices" (
    "date" TEXT NOT NULL,
    "btc_price" DOUBLE PRECISION NOT NULL,
    "gld_price" DOUBLE PRECISION,
    "spy_price" DOUBLE PRECISION,

    CONSTRAINT "historical_prices_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "miner_data" (
    "model" TEXT NOT NULL,
    "th" DOUBLE PRECISION NOT NULL,
    "watts" DOUBLE PRECISION NOT NULL,
    "efficency" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "miner_data_pkey" PRIMARY KEY ("model")
);

-- CreateTable
CREATE TABLE "market_data" (
    "id" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "market_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
