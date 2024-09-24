import fs from 'fs';
import path from 'path';
import fastcsv from 'fast-csv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtain pair name and interval from execution command line
const newCurrencyPair = process.env.NEWPAIR || '';
const interval = process.env.INTERVAL || '';
const directory = process.env.FILE_DIRECTORY || '';
const fileName = process.env.FILE_NAME || '';


// FILE_DIRECTORY='../../historical-data/Kraken_OHLCVT/XBTCAD/' FILE_NAME='test.csv' node csvFsStreamToSql.js

// node
// NEWPAIR=XBTCAD INTERVAL=1 node csvFsStreamToSql.ts

// Create new pair in Postgresql Database
// const currencyPair = await prisma.currencyPair.create({
//   data: {
//     id: newCurrencyPair,
//   },
// });

interface CurrencyPair {
  id: String;
}

interface OHLCVTRow {
  Timestamp: Date;
  id: Number;
  open: Number;
  high: Number;
  low: Number;
  close: Number;
  volume: Number;
  transactionCount: Number;
}

// import CurrencyPair from '../models/CurrenyPair';
// import OHLCVT from '../models/OHLCVT';

interface ohlcvtCsvRow {
  timestamp: Date;
  open: Number;
  high: Number;
  low: Number;
  Close: Number;
  Volume: Number;
  TransactionCount: Number;
}

// const csvLocation = path.join(__dirname, '../../historical-data/Kraken_OHLCVT/',newCurrencyPair, fileName)
const csvLocation = path.join(
  directory,
  newCurrencyPair,
  fileName
);
console.log(csvLocation)

fs.createReadStream(csvLocation)
  .pipe(fastcsv.parse({ headers: false }))
  .on('error', (error) => console.error(error))
  .on('data', (row) => console.log(row))
  .transform((row) => {
    // Transform the row data, for example, change the case of the first name
    return {
      ...row,
      firstName: row.firstName.toUpperCase(), // Example transformation
    };
  })
  .on('end', (rowCount: any) => console.log(`Parsed ${rowCount} rows`));


// 1 000 000 OHLCVT 1 Minute candles
// Unix Time Stamp, O, H, L, C, V, T
// 1435548420,315.0,315.0,315.0,315.0,0.25,1
// 1435612800,317.5,317.5,317.5,317.5,0.25,1
// 1435638120,319.99,319.99,319.99,319.99,0.5,1
// 1436433600,350.0,350.0,350.0,350.0,1,1
// 1436433960,350.0,350.0,350.0,350.0,0.0436,1
// 1436454240,365.0,365.0,365.0,365.0,0.2,1
// 1436458380,363.0,363.0,350.2,350.2,2.59710833,2
// 1436503320,350.0,350.0,350.0,350.0,0.4317,1
// 1436503380,350.0,350.0,350.0,350.0,0.0574,1
// 1436503500,350.0,350.0,350.0,350.0,0.0575,1
// 1436503860,350.0,350.0,350.0,350.0,0.1006,1
// 1436504100,350.0,350.0,350.0,350.0,0.0719,1
// 1436504160,350.0,350.0,350.0,350.0,0.0576,1
// 1436504460,350.0,350.0,350.0,350.0,0.0432,1
// 1436509080,350.0,350.0,350.0,350.0,0.2752,1
// 1436509560,350.0,350.0,350.0,350.0,0.1449,1
// 1436518260,350.2,350.2,350.2,350.2,0.1281,1
// 1436518500,350.2,350.2,350.2,350.2,0.0854,1
// 1436518680,350.2,350.2,350.2,350.2,0.18939167,1
// 1436671620,375.0,375.0,375.0,375.0,0.0399,1

// We want to add them sql in 1000 1 min candle chunks

// We stream to the file and add 1000 to memory and them to Postgresl using Prisma

// We close tidy up stream

// Initial version will do one file and interval at a time

// Service created to keep the file up to date in real time.

// Final version will process all teh files and extract currency pair and interval form file name
