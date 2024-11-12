import fs from 'fs';
import { getKrakenOHLCVVTData } from './krakenGetOhlc.js';
import { TickDataArray } from '../../types/index.js';

const [, , pair, interval, since]: string[] = process.argv;

// node krakenObjectToCsvUtil XBTCAD 1440 1711843200
const ohlcvtData: TickDataArray[] | undefined = await getKrakenOHLCVVTData(
  pair,
  interval,
  since
);

if (ohlcvtData === undefined) {
  throw new Error('Failed to fetch data or no data returned');
}

// Already done in previous module
// Map the array data to OHLCVT objects
// const ohlcvtData: OHLCVTStrings[] = ohlcvtUpdate.map((arr) => [
//   String(arr[0]),
//   arr[1],
//   arr[2],
//   arr[3],
//   arr[4],
//   // Skipping vwaps
//   arr[6],
//   String(arr[7]),
// ]);

console.log(ohlcvtData);

// Generate the CSV content
const csvContent = ohlcvtData
  .map(
    (row) =>
      `${row[0]},${row[1]},${row[2]},${row[3]},${row[4]},${row[5]},${row[6]}`
  )
  .join('\n');

try {
  fs.writeFileSync(`${pair}_${interval}.csv`, csvContent);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(
      'Error writing to file: ',
      err,
      err.message,
      err.name,
      err.stack
    );
  } else {
    throw new Error('Unknown error while writing to file: ');
  }
}

// Next step is sync the data on start
