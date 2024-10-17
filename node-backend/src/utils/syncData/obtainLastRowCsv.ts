import fs from 'fs/promises';

// Steps
// 1 obtain file stats
// 2 Create Buffer where data will be sotre
// 3 obtain start point
// 4 open the file
// 5 Start reading from starting position calculation based on file size - buffer size.
// 6 Convert chunk to string
// 7 Split the chunk into lines and prepend to the result
// 8 Close file descriptor
// 9 Return the lasts index(ie:line)

export default async function readLastLine(
  filePath: string
): Promise<string[]> {
  try {
    // 1. Obtain file stats
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;
    const bufferSize = 128;

    // 2. Create Buffer
    const buffer = Buffer.alloc(bufferSize);

    // 3. Obtain start point
    let position = Math.max(0, fileSize - bufferSize);

    // 4. Open the file
    const fd = await fs.open(filePath, 'r');
    let lines: string[] = [];

    // 5 Start reading from starting position calculation based on file size - buffer size.
    // Read the next chunk
    // @param buffer — A buffer that will be filled with the file data read.
    // @param offset — The location in the buffer at which to start filling. At the beginnign is 0.
    // @param length — The number of bytes to read.(bufferSize)
    // @param position
    // The location where to begin reading data from the file.
    // @return — Fulfills upon success with an object with two properties:
    const { bytesRead } = await fd.read(buffer, 0, bufferSize, position);

    // 6 Convert chunk to string
    const chunk = buffer.toString('utf-8', 0, bytesRead);
    // Example:
    // Chunks of data read 6199,1560
    // 1711756800,94795.0,95348.2,94689.2,94950.0,19.4054122,1388
    // 1711843200,94915.8,96636.9,94890.3,96526.9,18.15392732,1241
    // /n not showing but included

    // 7 Split the chunk into lines and prepend to the result
    lines = chunk.split('\n').concat(lines);

    // 8 Close the file descriptor
    await fd.close();

    // 9 Return the lasts index(ie:line)
    return lines.slice(-1);
  } catch (err) {
    throw err;
  }
}
