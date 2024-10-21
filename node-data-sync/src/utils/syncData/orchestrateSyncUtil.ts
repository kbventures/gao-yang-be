import obtainLastRowCsv from './obtainLastRowCsv.js';
import { getKrakenOHLCVVTData } from '../kraken/krakenGetOhlc.js';
import { TickDataArray } from '../../types/index.js';

const [, , pair, interval, filePath] = process.argv;

// Obtain last line from csv file we wish to sync
const lastLineOfCsv = await obtainLastRowCsv(filePath);

// Extract the timestamp from the string
const timestampExtract = lastLineOfCsv.slice(0, 9);

// Get updated Data
const Kraken_OHLCVT_data: TickDataArray[] | undefined =
  await getKrakenOHLCVVTData(pair, interval, timestampExtract);

// console.log(Kraken_OHLCVT_data?.[0] ?? 'Kraken API Call Undefined.');

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
