import { PrismaClient, Prisma } from '@prisma/client';
import { OHLCVT } from '../types';
import { getCurrencyPairs } from './currencyPairCrudUtil';

const prisma = new PrismaClient();
const [, , command, intervalString, uuid] = process.argv;

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

// node ohlcvtCrud.js getAll 1
export const getAllOHLVCTOfSpecificInterval = async (uuid: string) => {
  const interval = parseInt(intervalString);
  const OHLCVTInterval = intervalMap[interval - 1];

  try {
    const getAll = await (prisma[OHLCVTInterval] as any).findMany({
      where: { currencyPairId: uuid },
    });
    console.log('All OHLVCTs of speicific intervals: ', getAll);
  } finally {
    await prisma.$disconnect;
  }
};

// node ohlcvtCrud.js deleteAll 1
export const deletedAllOHLVCTOfSpecificInterval = async () => {
  const intervalString = process.argv[3];
  const interval = parseInt(intervalString);
  const OHLCVTInterval = intervalMap[interval - 1];
  try {
    const deleted = await (prisma[OHLCVTInterval] as any).deleteMany({});
    console.log(
      'All OHLVCTs of specific interval pair successfully deleted : ',
      deleted
    );
  } finally {
    await prisma.$disconnect();
  }
};

if (command === 'getAll') {
  getAllOHLVCTOfSpecificInterval(uuid);
} else if (command === 'deleteAll') {
  deletedAllOHLVCTOfSpecificInterval();
} else {
  console.log('Invalid command!');
}
