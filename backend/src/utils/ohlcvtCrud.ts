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


export const deleteAll = async () => {
    const pair = process.argv[3];
    const intervalString = process.argv[4]  
    const interval = parseInt(intervalString);
    const OHLCVTInterval = intervalMap[interval - 1];
  try {
    const deletedPair = await (prisma[OHLCVTInterval] as any).delete({
      where: { pair: pair },
    });
    console.log('Currency pair successfully delete: ', deletedPair);
  } finally {
    await prisma.$disconnect();
  }
};

if (command === 'deleteAll') {
  deleteAll();
} else {
  console.log('Invalid command! Use create, get or delete');
}

// node ohlcvtCrud deleteAll XBTCAD 1
