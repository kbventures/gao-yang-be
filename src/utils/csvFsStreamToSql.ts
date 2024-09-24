import fs from 'fs';
import path from 'path';
import fastcsv from 'fast-csv';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();

// Obtain pair name and interval from execution command line
const newCurrencyPair = process.env.NEWPAIR || "";
const interval = process.env.INTERVAL || "";

// node
// NEWPAIR=XBTCAD INTERVAL=1 node csvFsStreamToSql.ts

// Create new pair in Postgresql Database 
const currencyPair = await prisma.currencyPair.create({
    data:{
        id: newCurrencyPair,
    }
})


interface CurrencyPair {
    id: String;

}

interface TOHLCVTRow {
    Timestamp: Date;
    id: Number;
    open: Number;
    high: Number;
    low: Number;
    close: Number;
    volume: Number;
    transactionCount: Number;
}



// const oneMinIntervals = '../../historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1.csv'
const testfile = '../../historical-data/Kraken_OHLCVT/XBTCAD/test.csv'
let streamReader = fs.createReadStream(testfile)
    .pipe(fastcsv.parse({headers:false}))

streamReader.on('data', function (chunk) {
    console.log(chunk.toString());
});





// Process chunk

// Handle end of stream
streamReader.on('end', async () => {
    // Check to see if chunk is empty and handle if not empty

    await prisma.$disconnect();
});



// Handle Stream Errors
streamReader.on('error', (err)=>{
    console.error('Error reading the file:', err)
    prisma.$disconnect();
})



// 1 000 000 OHLCVT 1 Minute candles
// Unix Time Stamp, O, H, L, C, V, T
// 1435548420,315.0,315.0,315.0,315.0,0.25,1
// 1435612800,317.5,317.5,317.5,317.5,0.25,1
// 1435638120,319.99,319.99,319.99,319.99,0.5,1
// 1436433600,350.0,350.0,350.0,350.0,1,1
// 1436433960,350.0,350.0,350.0,350.0,0.0436,1
// 1436454240,365.0,365.0,365.0,365.0,0.2,1
// 1436458380,363.0,363.0,350.2,350.2,2.59710833,2
// 1436503320,350.0,350.0,350.0,350.0,0.4317,1
// 1436503380,350.0,350.0,350.0,350.0,0.0574,1
// 1436503500,350.0,350.0,350.0,350.0,0.0575,1
// 1436503860,350.0,350.0,350.0,350.0,0.1006,1
// 1436504100,350.0,350.0,350.0,350.0,0.0719,1
// 1436504160,350.0,350.0,350.0,350.0,0.0576,1
// 1436504460,350.0,350.0,350.0,350.0,0.0432,1
// 1436509080,350.0,350.0,350.0,350.0,0.2752,1
// 1436509560,350.0,350.0,350.0,350.0,0.1449,1
// 1436518260,350.2,350.2,350.2,350.2,0.1281,1
// 1436518500,350.2,350.2,350.2,350.2,0.0854,1
// 1436518680,350.2,350.2,350.2,350.2,0.18939167,1
// 1436671620,375.0,375.0,375.0,375.0,0.0399,1


// We want to add them sql in 1000 1 min candle chunks

// We stream to the file and add 1000 to memory and them to Postgresl using Prisma 

// We close tidy up stream

// Initial version will do one file and interval at a time

// Service created to keep the file up to date in real time. 

// Final version will process all teh files and extract currency pair and interval form file name
