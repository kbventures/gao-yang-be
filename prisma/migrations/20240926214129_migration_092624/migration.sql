/*
  Warnings:

  - You are about to drop the column `symbol` on the `CurrencyPair` table. All the data in the column will be lost.
  - You are about to drop the `OHLCVT` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `CurrencyPair` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "OHLCVT" DROP CONSTRAINT "OHLCVT_currencyPairId_fkey";

-- DropIndex
DROP INDEX "CurrencyPair_symbol_key";

-- AlterTable
ALTER TABLE "CurrencyPair" DROP COLUMN "symbol";

-- DropTable
DROP TABLE "OHLCVT";

-- CreateTable
CREATE TABLE "OHLCVT1" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(20,8) NOT NULL,
    "high" DECIMAL(20,8) NOT NULL,
    "low" DECIMAL(20,8) NOT NULL,
    "close" DECIMAL(20,8) NOT NULL,
    "volume" DECIMAL(20,8) NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currencyPairId" TEXT NOT NULL,

    CONSTRAINT "OHLCVT1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OHLCVT5" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(20,8) NOT NULL,
    "high" DECIMAL(20,8) NOT NULL,
    "low" DECIMAL(20,8) NOT NULL,
    "close" DECIMAL(20,8) NOT NULL,
    "volume" DECIMAL(20,8) NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currencyPairId" TEXT NOT NULL,

    CONSTRAINT "OHLCVT5_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OHLCVT15" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(20,8) NOT NULL,
    "high" DECIMAL(20,8) NOT NULL,
    "low" DECIMAL(20,8) NOT NULL,
    "close" DECIMAL(20,8) NOT NULL,
    "volume" DECIMAL(20,8) NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currencyPairId" TEXT NOT NULL,

    CONSTRAINT "OHLCVT15_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OHLCVT30" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(20,8) NOT NULL,
    "high" DECIMAL(20,8) NOT NULL,
    "low" DECIMAL(20,8) NOT NULL,
    "close" DECIMAL(20,8) NOT NULL,
    "volume" DECIMAL(20,8) NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currencyPairId" TEXT NOT NULL,

    CONSTRAINT "OHLCVT30_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OHLCVT60" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(20,8) NOT NULL,
    "high" DECIMAL(20,8) NOT NULL,
    "low" DECIMAL(20,8) NOT NULL,
    "close" DECIMAL(20,8) NOT NULL,
    "volume" DECIMAL(20,8) NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currencyPairId" TEXT NOT NULL,

    CONSTRAINT "OHLCVT60_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OHLCVT240" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(20,8) NOT NULL,
    "high" DECIMAL(20,8) NOT NULL,
    "low" DECIMAL(20,8) NOT NULL,
    "close" DECIMAL(20,8) NOT NULL,
    "volume" DECIMAL(20,8) NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currencyPairId" TEXT NOT NULL,

    CONSTRAINT "OHLCVT240_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OHLCVT720" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(20,8) NOT NULL,
    "high" DECIMAL(20,8) NOT NULL,
    "low" DECIMAL(20,8) NOT NULL,
    "close" DECIMAL(20,8) NOT NULL,
    "volume" DECIMAL(20,8) NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currencyPairId" TEXT NOT NULL,

    CONSTRAINT "OHLCVT720_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OHLCVT1440" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(20,8) NOT NULL,
    "high" DECIMAL(20,8) NOT NULL,
    "low" DECIMAL(20,8) NOT NULL,
    "close" DECIMAL(20,8) NOT NULL,
    "volume" DECIMAL(20,8) NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currencyPairId" TEXT NOT NULL,

    CONSTRAINT "OHLCVT1440_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OHLCVT1_timestamp_key" ON "OHLCVT1"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OHLCVT5_timestamp_key" ON "OHLCVT5"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OHLCVT15_timestamp_key" ON "OHLCVT15"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OHLCVT30_timestamp_key" ON "OHLCVT30"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OHLCVT60_timestamp_key" ON "OHLCVT60"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OHLCVT240_timestamp_key" ON "OHLCVT240"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OHLCVT720_timestamp_key" ON "OHLCVT720"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "OHLCVT1440_timestamp_key" ON "OHLCVT1440"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyPair_id_key" ON "CurrencyPair"("id");

-- AddForeignKey
ALTER TABLE "OHLCVT1" ADD CONSTRAINT "OHLCVT1_currencyPairId_fkey" FOREIGN KEY ("currencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OHLCVT5" ADD CONSTRAINT "OHLCVT5_currencyPairId_fkey" FOREIGN KEY ("currencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OHLCVT15" ADD CONSTRAINT "OHLCVT15_currencyPairId_fkey" FOREIGN KEY ("currencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OHLCVT30" ADD CONSTRAINT "OHLCVT30_currencyPairId_fkey" FOREIGN KEY ("currencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OHLCVT60" ADD CONSTRAINT "OHLCVT60_currencyPairId_fkey" FOREIGN KEY ("currencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OHLCVT240" ADD CONSTRAINT "OHLCVT240_currencyPairId_fkey" FOREIGN KEY ("currencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OHLCVT720" ADD CONSTRAINT "OHLCVT720_currencyPairId_fkey" FOREIGN KEY ("currencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OHLCVT1440" ADD CONSTRAINT "OHLCVT1440_currencyPairId_fkey" FOREIGN KEY ("currencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
