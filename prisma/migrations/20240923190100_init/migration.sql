-- CreateTable
CREATE TABLE "CurrencyPair" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "CurrencyPair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OHLCVT" (
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

    CONSTRAINT "OHLCVT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyPair_symbol_key" ON "CurrencyPair"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "OHLCVT_timestamp_key" ON "OHLCVT"("timestamp");

-- AddForeignKey
ALTER TABLE "OHLCVT" ADD CONSTRAINT "OHLCVT_currencyPairId_fkey" FOREIGN KEY ("currencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
