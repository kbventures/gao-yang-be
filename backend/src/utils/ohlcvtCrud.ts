import { PrismaClient, Prisma } from '@prisma/client';
import { OHLCVT } from '../types';

const prisma = new PrismaClient();


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

const command = process.argv[2];


export const getAllOHLVCTOfSpecificInterval = async () =>{
    const pair = process.env[2];
    const intervalString = process.argv[3]
    const interval = parseInt(intervalString);
    const OHLCVTInterval = intervalMap[interval-1]

    try {
        const getAll = await (prisma[OHLCVTInterval] as any).findMany();
        console.log("All OHLVCTs of speicific intervals: ", getAll);
    } finally {
        await prisma.$disconnect;
    }
}


export const deletedAllOHLVCTOfSpecificInterval = async () => {
    const pair = process.argv[2];
    const intervalString = process.argv[3]  
    const interval = parseInt(intervalString);
    const OHLCVTInterval = intervalMap[interval - 1];
  try {
    const deleted = await (prisma[OHLCVTInterval] as any).delete({
      where: { pair: pair },
    });
    console.log('All OHLVCTs of specific interval pair successfully deleted : ',deleted);
  } finally {
    await prisma.$disconnect();
  }
};


if(command === "getAll"){
    getAllOHLVCTOfSpecificInterval()
} else if(command === 'deleteAll') {
    deletedAllOHLVCTOfSpecificInterval();
} else {
  console.log('Invalid command!');
}

// node ohlcvtCrud deleteAll XBTCAD 1
