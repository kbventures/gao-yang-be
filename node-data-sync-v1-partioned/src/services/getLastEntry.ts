import { PrismaClient } from '@prisma/client';
import { CurrencyOHLCVTNames, OHLCVT } from '../types';

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

export default async function getLastEntry(pair: string, intervalStr: string) {
  const interval = parseInt(intervalStr);
  // Access the correct model based on the interval
  const OHLCVTInterval = intervalMap[interval - 1];
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
