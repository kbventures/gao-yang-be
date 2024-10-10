import fs from 'fs';
import { getKrakenOHLCVTData } from './krakenApiFetchFunction.js';
import { OHLCVT } from '../types/index.js';

const [, , pair, interval, since]: string[] = process.argv;
console.log('sanity check');

interface KrakenOHLVCVTResponse {
  result: Record<string, OHLCVT[]>;
  error: string[];
}

const ohlcvtUpdate: KrakenOHLVCVTResponse | undefined =
  await getKrakenOHLCVTData(pair, interval, since);

if (ohlcvtUpdate && ohlcvtUpdate.result && ohlcvtUpdate.result.XBTCAD) {
  console.dir(ohlcvtUpdate.result.XXBTZCAD, { depth: null });
} else if (ohlcvtUpdate == undefined) {
  throw new Error('Failed to fetch data or no data returned');
}

// for(t of ohlcvtUpdate.result.XXBTZCAD){
//     console.log(t)
// }
// const csvContent = ohlcvtUpdate.result.XXBTZCAD.map(row=>row.join(',')).join('\n');

// try{
// fs.writeFileSync(`${pair}_${interval}`, csvContent =>{
// });
// } catch(err:unknown){
//     if(err instanceof Error){
//         console.error("Error writing to file: ", err, err.message, err.name, err.stack)
//     } else {
//         throw new Error("Unknown error while writing to file: ")
//     }
// }
