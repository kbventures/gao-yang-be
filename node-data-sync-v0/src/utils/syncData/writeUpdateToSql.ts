import { PrismaClient } from '@prisma/client';
import {
  IntervalToIndexMap,
  TickDataArray,
  CurrencyOHLCVTNames,
} from '../../types';
import { Decimal } from 'decimal.js';

const Prisma = new PrismaClient();

const intervalToIndex: IntervalToIndexMap<number, number> = {
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

// Data to append (as an array )

export default async function writeUpdateToSql(
  tickerArray: TickDataArray[],
  pair: string,
  interval: string
) {
  const intervalNumber = parseInt(interval);

  // Get inde for CurrencyOHLCVTNames
  const OHLCVTIntervalNumber = intervalToIndex[intervalNumber];

  // Utilise index to find OHLCVT name to be used with Prisma
  const OHLCVTIntervalString = intervalMap[OHLCVTIntervalNumber];

  // Get uuid from pair name
  const uuid = pairToUuid[pair];

  const addedData = [];
  // console.log(tickerArray);
  try {
    for (const e of tickerArray) {
      const added = await (Prisma[OHLCVTIntervalString] as any).create({
        data: {
          timestamp: new Date(e[0] * 1000),
          open: new Decimal(e[1]),
          high: new Decimal(e[2]),
          low: new Decimal(e[3]),
          close: new Decimal(e[4]),
          volume: new Decimal(e[6]),
          transactionCount: e[7],
          currencyPairId: uuid,
        },
      });
      addedData.push(added);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error adding data to SQL: ', err.message);
      console.log('Error name: ', err.name);
      console.log(err.stack);
    } else {
      throw Error(`Error insterting data to SQL: ${err}`);
    }
  }
  // console.log(addedData.length);
  Prisma.$disconnect();
}
