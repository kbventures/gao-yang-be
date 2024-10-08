import { OHLCVT } from '../types/index';
import { PrismaClient } from '@prisma/client';
import { Decimal } from 'decimal.js';
const Prisma = new PrismaClient();

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
  'oHLCVT1440',
];

export async function insertChunks(
  c: OHLCVT[],
  pair: string,
  intervalString: string
) {
  const interval = parseInt(intervalString);
  // Access the correct model based on the interval
  const OHLCVTInterval = intervalMap[interval - 1];

  const addedData = [];
  for (const e of c) {
    try {
      const added = (Prisma[OHLCVTInterval] as any).create({
        data: {
          timestamp: e.timestamp,
          open: new Decimal(e.open),
          high: new Decimal(e.high),
          low: new Decimal(e.low),
          close: new Decimal(e.close),
          volume: new Decimal(e.volume),
          transactionCount: e.transactionCount,
          currencyPairId: pair,
        },
      });
      addedData.push(added);
      console.log('Entry added:', addedData);
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  }
  await Promise.all(addedData);
  console.log('addedData', addedData);
}
