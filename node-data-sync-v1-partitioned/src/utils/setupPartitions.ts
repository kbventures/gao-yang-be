// import { PrismaClient, sql } from '@prisma/client';

// const prisma = new PrismaClient();

// async function setupPartitions() {
//   await prisma.$executeRaw(sql`
//     CREATE TABLE IF NOT EXISTS ohlcvt (
//         id serial PRIMARY KEY,
//         timestamp timestamp NOT NULL,
//         open numeric,
//         high numeric,
//         low numeric,
//         close numeric,
//         volume numeric,
//         transaction_count int,
//         currency_pair varchar NOT NULL
//     ) PARTITION BY LIST (currency_pair);
//   `);

//   await prisma.$executeRaw(sql`
//     CREATE TABLE IF NOT EXISTS ohlcvt_btc_usd PARTITION OF ohlcvt FOR VALUES IN ('BTC/USD');
//     CREATE TABLE IF NOT EXISTS ohlcvt_eth_usd PARTITION OF ohlcvt FOR VALUES IN ('ETH/USD');
//   `);
// }

// setupPartitions()
//   .then(() => {
//     console.log("Partitions set up successfully.");
//   })
//   .catch((error) => {
//     console.error("Error setting up partitions:", error);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
