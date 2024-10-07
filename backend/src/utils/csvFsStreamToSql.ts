import path from 'path';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
// import myTransformStream from './transformStream.js';
import { PrismaClient } from '@prisma/client';
import { OHLCVT } from '../types/index';
import { updateGlobalVariables } from './updateGlobalVariables.js';
import { insertChunks } from './insertChunks.js';
import { myTransformStream } from './transformStream.js';

// Example usage:
// Create Pair
// Currency pairs:  [ { id: '2f75149f-0ff3-4c4d-8b18-504a07c3ab0a', pair: 'XBTCAD' } ]
// Get
// node currencyPairCrud.js get
// Run
// node UUID 1 ../../historical-data/Kraken_OHLCVT/test0.csv
// node csvFsStreamToSql.js b3831caf-b869-4f58-ad79-3d1e14c6a977 1 ../../historical-data/Kraken_OHLCVT/XBTCAD/test1.csv

const Prisma = new PrismaClient();

const [, , pair, intervalString, filePath] = process.argv;

let currentChunks: OHLCVT[] = [];
let currentChunkCount: number = 0;

fs.createReadStream(filePath)
  .pipe(fastcsv.parse({ headers: false }))
  .pipe(
    myTransformStream(async (data) => {
      const updatedState = updateGlobalVariables(
        data,
        currentChunks,
        currentChunkCount
      );
      currentChunks = updatedState.chunks;
      currentChunkCount = updatedState.count;
      if (currentChunkCount === 2) {
        await insertChunks(currentChunks, pair, intervalString);
        currentChunkCount = 0;
        currentChunks = [];
      }
    })
  )
  .on('error', (error) => console.error('Stream error:', error))
  .on('end', async () => {
    console.log('Sanity check');
    if (currentChunks.length > 0) {
      insertChunks(currentChunks, pair, intervalString);
    }
    Prisma.$disconnect();
  });
