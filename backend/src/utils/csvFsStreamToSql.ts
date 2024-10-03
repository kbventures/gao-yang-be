import path from 'path';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
// import myTransformStream from './transformStream.js';
import { PrismaClient } from '@prisma/client';
import { OHLCVT } from '../types/index';
// import { updateGlobalVariables } from './updateGlobalVariables.js';
// import { insertChunks } from './insertChunks.js';

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







import { Decimal } from 'decimal.js';



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


async function insertChunks(c:OHLCVT[], pair: string, intervalString: string){
    console.log("insertChunk Sanity Check!")
    const interval = parseInt(intervalString);
    // Access the correct model based on the interval
    const OHLCVTInterval = intervalMap[interval - 1];

    for (const e of c) {
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


  import { Transform } from 'stream';

function myTransformStream(updateGlobalVariables: (data: OHLCVT) => void) {
  const newTransform = new Transform({
    objectMode: true,
    async transform(row, encoding, callback) {
      const data = {
        // Assuming the CSV columns correspond to these properties
        timestamp: new Date(row[0] * 1000),
        open: Number(row[1]),
        high: Number(row[2]),
        low: Number(row[3]),
        close: Number(row[4]),
        volume: Number(row[5]),
        transactionCount: Number(row[6]),
      };
      // currentChunks.push(data);
      // console.log(data)
      // console.log(currentChunks)
      // currentChunkCount.count++;
      updateGlobalVariables(data);
      callback(null, data);
    },
  });
  return newTransform;
}


export function updateGlobalVariables(
  data: OHLCVT,
  currentChunks: OHLCVT[],
  currentChunkCount: number
) {
  const updatedchunks = [...currentChunks, data];
  const updatedCount = currentChunkCount + 1;
  return { chunks: updatedchunks, count: updatedCount };
}



