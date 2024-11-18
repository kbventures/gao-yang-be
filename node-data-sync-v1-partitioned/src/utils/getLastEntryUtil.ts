import { PrismaClient } from '@prisma/client';
import { CurrencyOHLCVTNames } from '../types';
import { cpuUsage } from 'process';

const [, , pair, intervalStr] = process.argv;

// Map the interval numbers to Prisma model names
const intervalMap: CurrencyOHLCVTNames[] = [
  'oHLCVT1',
  'oHLCVT5',
  'oHLCVT15',
  'oHLCVT30',
  'oHLCVT60',
  'oHLCVT240',
  'oHLCVT720',
  'oHLCVT1440',
];

const prisma = new PrismaClient();

/**
 * Fetches the last entry for a specified currency pair and interval from the database.
 *
 * @param {string} pair - The currency pair identifier (e.g., 'XBTCAD').
 * @param {string} intervalStr - The interval string representing the time period (e.g., '1440').
 * @returns {Promise<Object|null>} - Returns the last entry as an object or null if no entry found.
 */
export default async function getLastEntry(pair: string, intervalStr: string) {
  const interval = parseInt(intervalStr);
  // Access the correct model based on the interval
  const OHLCVTInterval = intervalMap[interval];

  try {
    const lastEntry = await (prisma[OHLCVTInterval] as any).findFirst({
      where: {
        currencyPairId: pair,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log('Sanity check', lastEntry);
    return lastEntry;
  } catch (error) {
    console.error('Error fetching last entry', error);
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  try {
    if (!pair || !intervalStr) {
      console.error('Please provide both currency pair and interval.');
      return;
    }
    await getLastEntry(pair, intervalStr);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message, err.name, err.stack);
    } else {
      throw new Error('Unexpected error.');
    }
  }
})();

// Example cpuUsage
// node getLastEntryUtil.js c4ce487f-53b7-4bd9-b398-3438847dddd4 7
// Sanity check {
//   id: 3144,
//   timestamp: 2024-03-19T00:00:00.000Z,
//   open: 91500,
//   high: 91979.3,
//   low: 83465.2,
//   close: 84100.1,
//   volume: 47.18277747,
//   transactionCount: 3346,
//   createdAt: 2024-10-22T17:26:31.684Z,
//   updatedAt: 2024-10-22T17:26:31.684Z,
//   currencyPairId: 'c4ce487f-53b7-4bd9-b398-3438847dddd4'
// }
