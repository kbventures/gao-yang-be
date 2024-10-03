import path from 'path';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
import myTransformStream from './transformStream.js';
import { PrismaClient } from '@prisma/client';
import { OHLCVT } from '../types/index';
import { updateGlobalVariables } from './updateGlobalVariables.js';
import { insertChunks } from './insertChunks.js';
// Example usage:
// Create Pair
// Currency pairs:  [ { id: '2f75149f-0ff3-4c4d-8b18-504a07c3ab0a', pair: 'XBTCAD' } ]
// Get 
// node currencyPairCrud.js get
// Run 
// node UUID 1 ../../historical-data/Kraken_OHLCVT/test.csv
// node csvFsStreamToSql.js a45234d8-1509-4a12-ad65-54a6bd195017 1 ../../historical-data/Kraken_OHLCVT/XBTCAD/test.csv 

const Prisma = new PrismaClient();

const [, , pair, intervalString, filePath] = process.argv;

let currentChunks: OHLCVT[] = [];
let currentChunkCount: number = 0;

fs.createReadStream(filePath)
  .pipe(fastcsv.parse({ headers: false }))
  .pipe(myTransformStream(async (data) => {
    const updatedState = updateGlobalVariables(data, currentChunks, currentChunkCount);
    currentChunks = updatedState.chunks;
    currentChunkCount = updatedState.count;
    if (currentChunkCount === 2) {
      insertChunks(currentChunks, pair, intervalString)
      currentChunkCount = 0;
      currentChunks = [];
    }
    console.log("chunk object content", currentChunks)
  }))
  .on('error', (error) => console.error('Stream error:', error))
  .on('end', async () => {
    console.log("Sanity check")
    if(currentChunks.length > 0){
      insertChunks(currentChunks, pair, intervalString)
    }
    Prisma.$disconnect();
  });



