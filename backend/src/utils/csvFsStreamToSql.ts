import path from 'path';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
import myTransformStream from './transformStream.js';
import { PrismaClient } from '@prisma/client';
import { OHLCVT } from '../types/index';
import { updateGlobalVariables } from './updateGlobalVariables.js';
import { Decimal } from 'decimal.js';

// Example usage:
// Create Pair
// Currency pairs:  [ { id: '2f75149f-0ff3-4c4d-8b18-504a07c3ab0a', pair: 'XBTCAD' } ]
// Get 
// node currencyPairCrud.js get
// Run 
// node UUID 1 ../../historical-data/Kraken_OHLCVT/test.csv
// node csvFsStreamToSql.js 67c3b84e-e87d-4b50-b6c8-a0cafbaaf392 1 ../../historical-data/Kraken_OHLCVT/XBTCAD/test.csv 
const Prisma = new PrismaClient();

const [, , pair, intervalString, filePath] = process.argv;

const interval = parseInt(intervalString);

// Define a type for the valid model names in Prisma
type PrismaCurrencyOHLCVTNames = 
  | 'oHLCVT1' 
  | 'oHLCVT5' 
  | 'oHLCVT15' 
  | 'oHLCVT30' 
  | 'oHLCVT60' 
  | 'oHLCVT240' 
  | 'oHLCVT720' 
  | 'oHLCVT1440';

// Map the interval numbers to Prisma model names
const intervalMap: PrismaCurrencyOHLCVTNames[] = [
  'oHLCVT1', 
  'oHLCVT5', 
  'oHLCVT15', 
  'oHLCVT30', 
  'oHLCVT60', 
  'oHLCVT240', 
  'oHLCVT720', 
  'oHLCVT1440'
];

// Access the correct model based on the interval
const OHLCVTInterval = intervalMap[interval - 1];

let currentChunks: OHLCVT[] = [];
let currentChunkCount: number = 0;

fs.createReadStream(filePath)
  .pipe(fastcsv.parse({ headers: false }))
  .pipe(myTransformStream(async (data) => {
    const updatedState = updateGlobalVariables(data, currentChunks, currentChunkCount);
    currentChunks = updatedState.chunks;
    currentChunkCount = updatedState.count;

    console.log(currentChunks, currentChunkCount)

    if (currentChunkCount === 2) {
      for (const e of currentChunks) {
        try {
          const added = await (Prisma[OHLCVTInterval] as any).create({
            data: {
              timestamp: e.timestamp,
              open: new Decimal(e.open),
              high: new Decimal(e.high),
              low: new Decimal(e.low),
              close: new Decimal(e.close),
              volume: new Decimal(e.volume),
              transactionCount: e.transactionCount,
              currencyPairId: pair
            }
          });
          console.log('Entry added:', added);
        } catch (error) {
          console.error('Error adding entry:', error);
        }
      }

      currentChunkCount = 0;
      currentChunks = [];
    }
    console.log(currentChunks)
  }))
  .on('error', (error) => console.error('Stream error:', error))
  .on('end', async () => {
    // Clean up
    console.log("Sanity Check")
    console.log(currentChunks, currentChunks.length)
    if(currentChunks.length > 0){
      for (const e of currentChunks) {
        try {
          const added = await (Prisma[OHLCVTInterval] as any).create({
            data: {
              timestamp: e.timestamp,
              open: new Decimal(e.open),
              high: new Decimal(e.high),
              low: new Decimal(e.low),
              close: new Decimal(e.close),
              volume: new Decimal(e.volume),
              transactionCount: e.transactionCount,
              currencyPairId: pair
            }
          });
          console.log('Entry added:', added);
        } catch (error) {
          console.error('Error adding entry:', error);
        }
      }

    }
    console.log("reading data")
    Prisma.$disconnect();
    console.log('Data processed and inserted');
  });


  // End Step is not firing
  // Need to check the following:
//   Check the CSV Format: Ensure that the CSV file is properly formatted and does not contain any issues (e.g., missing values, unexpected delimiters) that could cause the stream to fail.

// Validate the Transform Stream: If myTransformStream is processing the data asynchronously and there are unresolved promises or errors, it might prevent the stream from completing. Ensure that myTransformStream correctly handles errors and resolves all promises.

// Add More Logging: Add logging at different points in your code to see where it might be failing:

// Before starting the read stream.
// Inside myTransformStream before and after updating the global variables.
// At the beginning and end of the on('end') callback to see if it's getting there.
// Check for Errors: You have an error handler on the stream, but make sure that no other errors are being thrown silently, especially inside myTransformStream.

// Stream Pipeline Check: Ensure the entire pipeline (from createReadStream to fastcsv to your transform stream) is working without interruptions. You could try simplifying the pipeline temporarily to isolate the issue.
