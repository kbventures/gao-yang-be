import fs from 'fs';
import { getKrakenOHLCVVTData } from './krakenGetOhlc.js';
import { OHLCVTStrings, TickDataArray } from '../types/index.js';

const [, , pair, interval, since]: string[] = process.argv;

// node krakenObjectToCsvUtil XBTCAD 1440 1711843200
const ohlcvtUpdate: TickDataArray[] | undefined = await getKrakenOHLCVVTData(
  pair,
  interval,
  since
);

if (ohlcvtUpdate === undefined) {
  throw new Error('Failed to fetch data or no data returned');
}

// console.log(ohlcvtUpdate)

// if (ohlcvtUpdate && ohlcvtUpdate.result && ohlcvtUpdate.result.XBTCAD) {
//   console.dir(ohlcvtUpdate.result.XXBTZCAD, { depth: null });
// } else if (ohlcvtUpdate == undefined) {
//   throw new Error('Failed to fetch data or no data returned');
// }

// [
//   1720483200,
//   '77373.9',
//   '79392.4',
//   '76722.1',
//   '79122.3',
//   '78396.1', Volume Weighted Average Price not needed
//   '15.07409206',
//   1152
// ],
// ... 93 more items
// ]
// Map the array data to OHLCVT objects
const ohlcvtData: OHLCVTStrings[] = ohlcvtUpdate.map((arr) => [
  String(arr[0]),
  arr[1],
  arr[2],
  arr[3],
  arr[4],
  arr[6], // Ensure you're accessing the correct index (was arr[6])
  String(arr[7]), // Assuming this is the transaction count
]);

console.log(ohlcvtData);

// // Generate the CSV content
// const csvContent = ohlcvtData.map(row =>
//   `${row.timestamp},${row.open},${row.high},${row.low},${row.close},${row.volume},${row.vwap},${row.count}`
// ).join('\n');

// try{
// fs.writeFileSync(`${pair}_${interval}.csv`, csvContent)
// } catch(err:unknown){
//     if(err instanceof Error){
//         console.error("Error writing to file: ", err, err.message, err.name, err.stack)
//     } else {
//         throw new Error("Unknown error while writing to file: ")
//     }
// }
