import path from 'path';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
import myTransformStream  from './transformStream.js';
// import { PrismaClient } from '@prisma/client';
import { OHLCVT, ChunkCount } from '../types/index';
import { updateGlobalVariables } from './updateGlobalVariables.js';

// // Obtain pair name and interval from execution command line
const newCurrencyPair = process.env.NEWPAIR || '';
const interval = process.env.INTERVAL || '';
const directory = process.env.FILE_DIRECTORY || '';
const fileName = process.env.FILE_NAME || '';
const chunkMax = process.env.CHUNK_MAX || '';

let currentChunks: OHLCVT[] = [];
let currentChunkCount: number =0;

// // FILE_DIRECTORY='../../historical-data/Kraken_OHLCVT/XBTCAD/' FILE_NAME='test.csv' node csvFsStreamToSql.js

const csvLocation = path.join(
  directory || __dirname,
  newCurrencyPair,
  fileName
);


fs.createReadStream(csvLocation)
  .pipe(fastcsv.parse({ headers: false }))
  .pipe(myTransformStream((data)=>{
    const updatedState = updateGlobalVariables(data, currentChunks, currentChunkCount);
    currentChunks = updatedState.chunks; 
    currentChunkCount = updatedState.count;
    console.log(currentChunks,currentChunkCount)
  }))
  .on('error', (error) => console.error(error))
  .on('end', () => {
    console.log('Data processed and inserted');
    console.log("currentCunks", currentChunks)
  });

// prisma.$disconnect(); // Disconnect Prisma client

// Todo Prisma Disconect Location?
// Add entries to Postgresql and make sure it works
// Add in chunks
// Error handling
// Automated Testing

// // 1 000 000 OHLCVT 1 Minute candles
// // Unix Time Stamp, O, H, L, C, V, T
// // 1435548420,315.0,315.0,315.0,315.0,0.25,1
// // 1435612800,317.5,317.5,317.5,317.5,0.25,1
// // 1435638120,319.99,319.99,319.99,319.99,0.5,1
// // 1436433600,350.0,350.0,350.0,350.0,1,1
// // 1436433960,350.0,350.0,350.0,350.0,0.0436,1
// // 1436454240,365.0,365.0,365.0,365.0,0.2,1
// // 1436458380,363.0,363.0,350.2,350.2,2.59710833,2
// // 1436503320,350.0,350.0,350.0,350.0,0.4317,1
// // 1436503380,350.0,350.0,350.0,350.0,0.0574,1
// // 1436503500,350.0,350.0,350.0,350.0,0.0575,1
// // 1436503860,350.0,350.0,350.0,350.0,0.1006,1
// // 1436504100,350.0,350.0,350.0,350.0,0.0719,1
// // 1436504160,350.0,350.0,350.0,350.0,0.0576,1
// // 1436504460,350.0,350.0,350.0,350.0,0.0432,1
// // 1436509080,350.0,350.0,350.0,350.0,0.2752,1
// // 1436509560,350.0,350.0,350.0,350.0,0.1449,1
// // 1436518260,350.2,350.2,350.2,350.2,0.1281,1
// // 1436518500,350.2,350.2,350.2,350.2,0.0854,1
// // 1436518680,350.2,350.2,350.2,350.2,0.18939167,1
// // 1436671620,375.0,375.0,375.0,375.0,0.0399,1
