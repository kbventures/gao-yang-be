import fs from 'fs';
import { getKrakenOHLCVTData } from './krakenApiFetchFunction.js';
import { OHLCVT } from '../types/index.js';

const [, , pair, interval, since]: string[] = process.argv;

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

const csvContent = ohlcvtUpdate.result.XXBTZCAD.map(
  (row) =>
    `${row.timestamp},${row.open},${row.high},${row.low},${row.close},${row.volume},${row.transactionCount}`
).join('\n');

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
