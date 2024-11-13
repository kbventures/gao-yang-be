import { PrismaClient } from '@prisma/client';
import { CurrencyOHLCVTNames } from '../types';

const intervalToIndex: Record<number, number> = {
  1: 0,
  5: 1,
  15: 2,
  30: 3,
  60: 4,
  240: 5,
  720: 6,
  1440: 7,
};

const pairToUuid: Record<string, string> = {
  XBTCAD: '14c331a5-e0f2-4585-b0aa-4558fb10873a',
};

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
  const OHLCVTInterval = intervalMap[intervalToIndex[interval]];

  let uuidPairIdentifier = pairToUuid[pair];

  try {
    const lastEntry = await (prisma[OHLCVTInterval] as any).findFirst({
      where: {
        currencyPairId: uuidPairIdentifier,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return lastEntry;
  } catch (error) {
    console.error('Error fetching last entry', error);
  } finally {
    await prisma.$disconnect();
  }
}
