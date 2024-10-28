import fs from 'fs/promises';

// Steps
// 1. Obtain file stats
// 2. Create Buffer where data will be stored
// 3. Obtain start point
// 4. Open the file
// 5. Start reading from starting position calculation based on file size - buffer size.
// 6. Convert chunk to string
// 7. Split the chunk into lines and return the last line
// 8. Close file descriptor

export default async function readLastLine(filePath: string): Promise<string> {
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

    // 5. Start reading from starting position
    const { bytesRead } = await fd.read(buffer, 0, bufferSize, position);

    // 6. Convert chunk to string
    const chunk = buffer.toString('utf-8', 0, bytesRead);

    // 7. Split the chunk into lines
    const lines = chunk.split('\n');

    // Get the last line (if it exists)
    const lastLine = lines[lines.length - 1] || '';

    // 8. Close the file descriptor
    await fd.close();

    // Return the last line as a string
    return lastLine;
  } catch (err) {
    throw err;
  }
}
