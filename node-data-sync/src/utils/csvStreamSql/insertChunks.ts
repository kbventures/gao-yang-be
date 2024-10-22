import { OHLCVT } from '../../types/index';
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

/**
 * Inserts an array of OHLCVT data into the corresponding Prisma model.
 *
 * @param {OHLCVT[]} c - An array of OHLCVT data objects to be inserted.
 * @param {string} pair - The currency pair UUID associated with the data.
 * @param {string} intervalString - The interval string representing the data interval (e.g., "0" for 1 minutes... "7" for 1440minutes).
 *
 * @returns {Promise<void>} A promise that resolves when all data has been inserted.
 *
 * @throws {Error} Will log errors to the console if an entry fails to be added.
 */
export async function insertChunks(
  c: OHLCVT[],
  pair: string,
  intervalString: string
) {
  const interval = parseInt(intervalString);
  // Access the correct model based on the interval
  const OHLCVTInterval = intervalMap[interval];

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
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  }
  await Promise.all(addedData);
}
