import path from 'path';
import fs from 'fs';
import * as fastcsv from 'fast-csv';
import myTransformStream from './transformStream.js';
import { PrismaClient } from '@prisma/client';
import { OHLCVT } from '../types/index';
import { updateGlobalVariables } from './updateGlobalVariables.js';
import { Decimal } from 'decimal.js';

const Prisma = new PrismaClient();

// Example util usage
// node server.js XBTUSD 1 ../../historical-data/Kraken_OHLCVT/XBTCAD/test.csv

// // Obtain pair name and interval from execution command line
const [, , pair, interval, filePath] = process.argv;


type PrismaCurrencyOHLCVTNames  = 'oHLCVT1' | 'oHLCVT5'
// Create model dynamically 
const OHLCVTInterval = 'oHLCVT' + interval as PrismaCurrencyOHLCVTNames
// const chunkMax;


let currentChunks: OHLCVT[] = [];
let currentChunkCount: number = 0;


fs.createReadStream(filePath)
  .pipe(fastcsv.parse({ headers: false }))
  .pipe(myTransformStream((data)=>{
    const updatedState = updateGlobalVariables(data, currentChunks, currentChunkCount);
    currentChunks = updatedState.chunks;
    currentChunkCount = updatedState.count;
    //****************
    if(currentChunkCount === 2){
      currentChunks.forEach(async e=>{
        console.log(e)
        const added = await Prisma[OHLCVTInterval].create({
          data:{
            timestamp: e.timestamp,
            open: new Decimal(e.open),
            high: new Decimal(e.high),
            low: new Decimal(e.low),
            close: new Decimal(e.close),
            volume: new Decimal(e.volume),
            transactionCount: e.transactionCount,
            currencyPairId: pair
          }
        })
        console.log("added", added)
      })
      currentChunkCount=0;
      currentChunks=[];
    }
  }))
  .on('error', (error) => console.error(error))
  .on('end', () => {
    console.log('Data processed and inserted');
    console.log("currentCunks", currentChunks)
  });


  //model CurrencyPair {
    //     id         String       @id @unique @default(uuid()) @db.Uuid
    //     pair       String       @unique
    //     ohlcvt1    OHLCVT1[]
    //     ohlcvt5    OHLCVT5[]
    //     ohlcvt15   OHLCVT15[]
    //     ohlcvt30   OHLCVT30[]
    //     ohlcvt60   OHLCVT60[]
    //     ohlcvt240  OHLCVT240[]
    //     ohlcvt720  OHLCVT720[]
    //     ohlcvt1440 OHLCVT1440[]
    //   }
      
    //   model OHLCVT1 {
    //     id               Int      @id @default(autoincrement())
    //     timestamp        DateTime @unique
    //     open             Decimal  @db.Decimal(20, 8)
    //     high             Decimal  @db.Decimal(20, 8)
    //     low              Decimal  @db.Decimal(20, 8)
    //     close            Decimal  @db.Decimal(20, 8)
    //     volume           Decimal  @db.Decimal(20, 8)
    //     transactionCount Int
    //     createdAt        DateTime @default(now())
    //     updatedAt        DateTime @updatedAt
      
    //     currencyPairId String       @db.Uuid
    //     currencyPair   CurrencyPair @relation(fields: [currencyPairId], references: [id])
    //   }

