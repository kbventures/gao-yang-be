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
// 9

// 2 Obtain process.argv values
const [, , pair, interval, filePath]: string[] = process.argv;

async function readLastLines(
  filePath: string,
  linesToRead: number = 2
): Promise<string[]> {
  try {
    // 4. Obtain file stats
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;
    const bufferSize = 1024;

    // 5. Create Buffer
    const buffer = Buffer.alloc(bufferSize);

    // 6. Obtain start point
    let position = Math.max(0, fileSize - bufferSize);

    // 7. Open the file
    const fd = await fs.open(filePath, 'r');
    let lines: string[] = [];

    // 8. Start reading chunks
    while (position >= 0) {
      // Read the next chunk
      // @param buffer — A buffer that will be filled with the file data read.
      // @param offset — The location in the buffer at which to start filling.
      // @param length — The number of bytes to read.
      // @param position
      // The location where to begin reading data from the file. If null, data will be read from the current file position, and the position will be updated. If position is an integer, the current file position will remain unchanged.
      // @return — Fulfills upon success with an object with two properties:
      const { bytesRead } = await fd.read(buffer, 0, bufferSize, position);
      const chunk = buffer.toString('utf-8', 0, bytesRead);

      // Split the chunk into lines and prepend to the result
      lines = chunk.split('\n').concat(lines);

      // Update the position to read the next chunk
      position -= bufferSize;

      // If we have enough lines, we can stop reading
      if (lines.length >= linesToRead) {
        break; // Exit the loop
      }
    }

    await fd.close(); // Close the file descriptor
    return lines.slice(-linesToRead); // Return the last requested lines
  } catch (err) {
    throw err; // Propagate errors
  }
}

// 3 immediately invoked function expression calls readLastRow
(async () => {
  try {
    const lastLines = await readLastLines(filePath);
    console.log('Last lines:', lastLines);
  } catch (error) {
    console.error('Error reading last lines:', error);
  }
})();
