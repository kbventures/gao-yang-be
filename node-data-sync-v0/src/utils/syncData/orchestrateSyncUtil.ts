import obtainLastRowCsv from './obtainLastRowCsv.js';
import { getKrakenOHLCVVTData } from '../kraken/krakenGetOhlc.js';
import { TickDataArray } from '../../types/index.js';
import getLastEntry from '../getLastEntry.js';
import writeUpdateToCsv from './writeUpdateToCsv.js';
import writeUpdateToSql from './writeUpdateToSql.js';

const [, , pair, interval, filePath] = process.argv;

// node orchestrateSyncUtil.js XBTCAD 1440 ../../../historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1440.csv

try {
  // Obtain last line from csv file we wish to sync
  const lastLineOfCsv = await obtainLastRowCsv(filePath);

  // Extract the timestamp from the string
  const timeStampExtract = lastLineOfCsv.slice(0, 10);

  // // Get updated Data(Exclusive result. ie: starts from the next entry after timestampExtract)
  const Kraken_OHLCVT_data: TickDataArray[] | undefined =
    await getKrakenOHLCVVTData(pair, interval, timeStampExtract);

  // Get last saved OHLCVT entry in sql database for specific pair and interval
  const sqlOhlcvt = await getLastEntry(pair, interval);

  // Append data to CSV  && SQL
  // Check if Kraken_OHLCVT_data is defined and has entries and
  if (Kraken_OHLCVT_data && Kraken_OHLCVT_data.length > 0 && sqlOhlcvt) {
    await writeUpdateToCsv(Kraken_OHLCVT_data, filePath);
    await writeUpdateToSql(Kraken_OHLCVT_data, pair, interval);
  }
} catch (err) {
  if (err instanceof Error) {
    console.log(err.message);
    console.log(err.stack);
    console.log(err.name);
  } else {
    throw Error(
      'Unknown error during sync orchestraction of csv and sql data.'
    );
  }
}

// Append data to SQl

// await
