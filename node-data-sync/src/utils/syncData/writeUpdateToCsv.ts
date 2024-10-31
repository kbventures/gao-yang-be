import fs from 'fs/promises';
import { TickDataArray } from '../../types';

export default async function writeUpdateToCsv(
  ohlcvtArray: TickDataArray[],
  filePath: string
) {
  const rows = ohlcvtArray.map((row) => row.join(',')).join('\n');

  try {
    await fs.appendFile(filePath, rows);
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
