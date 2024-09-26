import path from 'path';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
import myTransformStream from './transformStream.js';
import { PrismaClient } from '@prisma/client';
import { OHLCVT } from '../types/index';
import { updateGlobalVariables } from './updateGlobalVariables.js';
import { Decimal } from 'decimal.js';

const Prisma = new PrismaClient();

// // Obtain pair name and interval from execution command line
const newCurrencyPair = process.env.NEWPAIR || '';
const interval = process.env.INTERVAL || '';
const directory = process.env.FILE_DIRECTORY || '';
const fileName = process.env.FILE_NAME || '';
const chunkMax = process.env.CHUNK_MAX || '';

let currentChunks: OHLCVT[] = [];
let currentChunkCount: number = 0;

const pair = await Prisma.currencyPair.create({
  data: {
    id: newCurrencyPair,
  },
});

// const check = await Prisma.currencyPair.findMany('XBTCAD')
// console.log(check)
// console.log("added", pair)

// ~/Programming/gao-yang-be/dist/utils$ INTERVAL=1 NEWPAIR=XBTCAD FILE_DIRECTORY='../../historical-data/Kraken_OHLCVT/XBTCAD/' FILE_NAME='test.csv' node csvFsStreamToSql.js

const csvLocation = path.join(
  directory || __dirname,
  newCurrencyPair,
  fileName
);

// fs.createReadStream(csvLocation)
//   .pipe(fastcsv.parse({ headers: false }))
//   .pipe(myTransformStream((data)=>{
//     const updatedState = updateGlobalVariables(data, currentChunks, currentChunkCount);
//     currentChunks = updatedState.chunks;
//     currentChunkCount = updatedState.count;
//     //****************
//     if(currentChunkCount === 2){
//       currentChunks.forEach(async e=>{
//         console.log(e)
//         const added = await Prisma.oHLCVT1.create({
//           data:{
//             timestamp: e.timestamp,
//             open: new Decimal(e.open),
//             high: new Decimal(e.high),
//             low: new Decimal(e.low),
//             close: new Decimal(e.close),
//             volume: new Decimal(e.volume),
//             transactionCount: e.transactionCount,
//             currencyPairId: newCurrencyPair
//           }
//         })
//         console.log("added", added)
//       })
//       currentChunkCount=0;
//       currentChunks=[];
//     }
//   }))
//   .on('error', (error) => console.error(error))
//   .on('end', () => {
//     console.log('Data processed and inserted');
//     console.log("currentCunks", currentChunks)
//   });

// Test
// Error handling
// Setup final on end clean up
// Move all data to database for one minute candle
// Make data available in database
// Index and optimised querying
// Make features available
