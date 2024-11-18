import fs from 'fs/promises';
import { TickDataArray } from '../../types';

export default async function writeUpdateToCsv(
  ohlcvtArray: TickDataArray[],
  filePath: string
) {
  const rows = ohlcvtArray
    .map((row) =>
      [row[0], row[1], row[2], row[3], row[5], row[6], row[7]].join(',')
    )
    .join('\n');
  // const dataToAppend = `\n${rows}`;
  try {
    await fs.appendFile(filePath, rows);
    console.log('row length, ', rows.length);
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error appending data to CSV:', err.message); // Start with the message
      console.log('Error name:', err.name);
      console.log(err.stack);
    } else {
      throw Error(`Error appending data to CSV: ${err}`);
    }
  }
}

// original has 3144 entries in both the csv and sql database
