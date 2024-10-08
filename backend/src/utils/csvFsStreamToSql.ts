import path from 'path';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
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
// node csvFsStreamToSql.js e5769b1e-d032-4408-b348-e71b9ff1de7d 1 ../../historical-data/Kraken_OHLCVT/XBTCAD/test1.csv

// node csvFsStreamToSql.js e5769b1e-d032-4408-b348-e71b9ff1de7d 1440 ../../historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1440.csv

const Prisma = new PrismaClient();

const [, , pair, intervalString, filePath] = process.argv;

let currentChunks: OHLCVT[] = [];
let currentChunkCount: number = 0;

const stream = fs
  .createReadStream(filePath)
  .pipe(fastcsv.parse({ headers: false }))
  .pipe(
    myTransformStream(async (data) => {
      console.log('Received data:', data); // Log received data
      const updatedState = updateGlobalVariables(
        data,
        currentChunks,
        currentChunkCount
      );
      currentChunks = updatedState.chunks;
      currentChunkCount = updatedState.count;
      if (currentChunkCount == 3) {
        // this.pause()
        try {
          stream.pause();
          await insertChunks(currentChunks, pair, intervalString);
          currentChunkCount = 0;
          currentChunks = [];
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error occured at chunk', currentChunks, error);
          } else {
            throw new Error('Uknown Error Occurred');
          }
        }
      }
      stream.resume();
    })
  )
  .on('error', (error) => console.error('Stream error:', error))
  .on('end', async () => {
    console.log('On end triggered?!?!');
    if (currentChunks.length > 0) {
      await insertChunks(currentChunks, pair, intervalString);
    }
    Prisma.$disconnect();
  });
