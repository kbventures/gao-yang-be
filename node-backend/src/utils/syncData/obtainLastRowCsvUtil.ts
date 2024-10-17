import fs from 'fs/promises';
// Steps
// 1 node obtainLastRowCsvUtil.js XBTCAD 1440 /home/ken/Programming/gao-yang-be/node-backend/historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1440.csv
// 2 obtain process values
// 3 immediately invoked function expression calls readLastRow
// 4 obtain file stats
// 5 Create Buffer where data will be sotre
// 6 obtain start point
// 7 open the file
// 8 start reading chunks
// 9 Start reading from starting position calculation based on file size - buffer size.
// 10 Convert chunk to string

// 2 Obtain process.argv values
const [, , pair, interval, filePath]: string[] = process.argv;

export default async function readLastLine(
  filePath: string
  // linesToRead: number = 2
): Promise<string[]> {
  try {
    // 4. Obtain file stats
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;
    const bufferSize = 128;

    // 5. Create Buffer
    // Buffer.alloc(size[, fill[, encoding]])
    const buffer = Buffer.alloc(bufferSize);

    // 6. Obtain start point
    let position = Math.max(0, fileSize - bufferSize);

    // 7. Open the file
    const fd = await fs.open(filePath, 'r');
    let lines: string[] = [];

    // 8 Start reading from starting position calculation based on file size - buffer size.
    // Read the next chunk
    // @param buffer — A buffer that will be filled with the file data read.
    // @param offset — The location in the buffer at which to start filling. At the beginnign is 0.
    // @param length — The number of bytes to read.(bufferSize)
    // @param position
    // The location where to begin reading data from the file.
    // @return — Fulfills upon success with an object with two properties:
    const { bytesRead } = await fd.read(buffer, 0, bufferSize, position);

    // 9 Convert chunk to string
    const chunk = buffer.toString('utf-8', 0, bytesRead);
    // Example:
    // Chunks of data read 6199,1560
    // 1711756800,94795.0,95348.2,94689.2,94950.0,19.4054122,1388
    // 1711843200,94915.8,96636.9,94890.3,96526.9,18.15392732,1241

    // 10 Split the chunk into lines and prepend to the result
    lines = chunk.split('\n').concat(lines);

    // 11 Close the file descriptor
    await fd.close();

    // 12 Return the lasts index(ie:line)
    return lines.slice(-1);
  } catch (err) {
    throw err; 
  }
}

// 3 immediately invoked function expression calls readLastRow
(async () => {
  try {
    const lastLines = await readLastLine(filePath);

    // Last lines: [
    //   '1711756800,94795.0,95348.2,94689.2,94950.0,19.4054122,1388',
    //   '1711843200,94915.8,96636.9,94890.3,96526.9,18.15392732,1241'
    // ]
    console.log('Last lines:', lastLines);
  } catch (error) {
    console.error('Error reading last lines:', error);
  }
})();

// Todo
// Finish sync csv and sql
// Work on front end to obtain
