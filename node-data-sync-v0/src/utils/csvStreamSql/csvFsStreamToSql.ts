import fs from 'fs';
import * as fastcsv from 'fast-csv';
import { PrismaClient } from '@prisma/client';
import { OHLCVT } from '../../types/index';
import { updateGlobalVariables } from './updateGlobalVariables.js';
import { insertChunks } from './insertChunks.js';
import { myTransformStream } from './transformStream.js';

const Prisma = new PrismaClient();

/**
 * Main function to process CSV data and insert it into PostgreSQL.
 *
 * @param {string} pair - The currency pair identifier.
 * @param {string} intervalString - The time interval for data.
 * @param {string} filePath - The path to the CSV file.
 * @param {number} CHUNK_SIZE - The size of data chunks to be processed.
 */

const [, , pair, intervalString, filePath, CHUNK_SIZE] = process.argv;

let currentChunks: OHLCVT[] = [];
let currentChunkCount: number = 0;
let totalCount: number = 0;

const stream = fs
  .createReadStream(filePath)
  .pipe(fastcsv.parse({ headers: false }))
  .pipe(
    myTransformStream(async (data) => {
      const updatedState = updateGlobalVariables(
        data,
        currentChunks,
        currentChunkCount,
        totalCount
      );
      currentChunks = updatedState.chunks;
      currentChunkCount = updatedState.count;
      totalCount = updatedState.total;
      if (currentChunkCount == Number(CHUNK_SIZE)) {
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
      try {
        await insertChunks(currentChunks, pair, intervalString);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error occured at chunk', currentChunks, error);
        } else {
          throw new Error('Uknown Error Occurred');
        }
      }
    }
    console.log('Total count: ', totalCount);
    Prisma.$disconnect();
  });

// Example usage:
// Create Pair
// Currency pairs:  [ { id: 'c4ce487f-53b7-4bd9-b398-3438847dddd4', pair: 'XBTCAD' } ]
// node currencyPairCrud.js get
// Run
// node UUID 1 ../../historical-data/Kraken_OHLCVT/test0.csv
// node csvFsStreamToSql.js c4ce487f-53b7-4bd9-b398-3438847dddd4 1440 ../../historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1440.csv 1000

// node csvFsStreamToSql.js 1112b698-1a1f-48fb-8584-3664eb267dc4 8 ../../historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1440.csv 1000

// node csvFsStreamToSql.js c4ce487f-53b7-4bd9-b398-3438847dddd4 1440 ../../../historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1440.csv 1000
