import path from 'path';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
import myTransformStream from './transformStream.js';
import { PrismaClient } from '@prisma/client';
import { OHLCVT } from '../types/index';
import { updateGlobalVariables } from './updateGlobalVariables.js';
import { Decimal } from 'decimal.js';

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
  }))
  .on('error', (error) => console.error('Stream error:', error))
  .on('end', () => {
    console.log('Data processed and inserted');
  });
