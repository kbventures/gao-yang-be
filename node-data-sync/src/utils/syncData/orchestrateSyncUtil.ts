import obtainLastRowCsv from './obtainLastRowCsv.js';
import { getKrakenOHLCVVTData } from '../kraken/krakenGetOhlc.js';
import { TickDataArray } from '../../types/index.js';
import getLastEntry from '../getLastEntry.js';

const [, , pair, interval, filePath] = process.argv;

// CREATE UTILITY TO TEST THE DATA BEFORE APPENDING NEW DATA?

// Obtain last line from csv file we wish to sync
const lastLineOfCsv = await obtainLastRowCsv(filePath);

// Extract the timestamp from the string
const timeStampExtract = lastLineOfCsv.slice(0, 10);

// // Get updated Data(Exclusive result. ie: starts from the next entry after timestampExtract)
const Kraken_OHLCVT_data: TickDataArray[] | undefined =
  await getKrakenOHLCVVTData(pair, interval, timeStampExtract);

// Check if Kraken_OHLCVT_data is defined and has entries and
if (Kraken_OHLCVT_data && Kraken_OHLCVT_data.length > 0) {
  const firstEntry = Kraken_OHLCVT_data[0];
  const lastEntry = Kraken_OHLCVT_data[210];
  console.log('First entry:', firstEntry);
  console.log('Last entry:', lastEntry);
} else {
  console.log('Kraken API Call Undefined or no data available.');
}

const sqlOhlcvt = await getLastEntry(pair, interval);

if (sqlOhlcvt) {
  console.log('sqlOhlcvt: ', sqlOhlcvt);
} else {
  console.log(
    `Call to get last entry of ${pair} @ innterval ${interval} returns undefined.21`
  );
}
// node orchestrateSyncUtil.js XBTCAD 1440 ../../../historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1440.csv
// 1711843200,94915.8,96636.9,94890.3,96526.9,18.15392732,1241
// [
//   1667347200,
//   '27853.2',
//   '28169.5',
//   '27389.0',
//   '27553.0',
//   '27807.5',
//   '71.75127409',
//   1236
// ]

// console.log(lastLineOfCsv);
// console.log(timestampExtract);
// console.log(Kraken_OHLCVT_data);

// CREATE UTILITY TO TEST NEW DATA?

// Append data to CSV

// Append data to SQl
