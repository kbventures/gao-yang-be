import fs from 'fs/promises';
// Steps
// 1 node obtainLastRowCsvUtil.js node obtainLastRowCsvUtil.js /home/ken/Programming/gao-yang-be/node-data-sync/historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1440.csv
// 2 obtain process values
// 3 immediately invoked function expression calls readLastRow
// 4 obtain file stats
// 5 Create Buffer where data will be sotre
// 6 obtain start point
// 7 open the file
// 8 start reading chunks
// 9 Start reading from starting position calculation based on file size - buffer size.
// 10 Convert chunk to string
// 11 Close file descriptor

// 2 Obtain process.argv values
const [, , filePath]: string[] = process.argv;

if (!filePath) {
  console.error('Please provide file path.');
  process.exit(1);
}

export default async function readLastLine(filePath: string): Promise<string> {
  console.log(filePath);
  try {
    // 4 Obtain file stats
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;
    const bufferSize = 128;

    // 5 Create Buffer
    const buffer = Buffer.alloc(bufferSize);

    // 6 Obtain start point
    let position = Math.max(0, fileSize - bufferSize);

    // 7 Open the file
    const fd = await fs.open(filePath, 'r');

    // 8 Start reading from starting position
    const { bytesRead } = await fd.read(buffer, 0, bufferSize, position);

    // 9 Convert chunk to string
    const chunk = buffer.toString('utf-8', 0, bytesRead);
    const lines = chunk.split('\n');
    const lastLine = lines[lines.length - 1] || '';

    // 10 Close the file descriptor
    await fd.close();

    // Return the last line as a string
    return lastLine;
  } catch (err) {
    throw err;
  }
}

// 3 immediately invoked function expression calls readLastRow
(async () => {
  try {
    const lastLines = await readLastLine(filePath);

    // Last lines: [ '1711843200,94915.8,96636.9,94890.3,96526.9,18.15392732,1241' ]
    console.log('Last lines:', lastLines);
  } catch (error) {
    console.error('Error reading last lines:', error);
  }
})();
