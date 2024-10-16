import fs from 'fs/promises';

const [, , pair, interval, sinc, filePath]: string[] = process.argv;

export async function readLastRow(filePath: string): Promise<string> {
  try {
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;
    const bufferSize = 1024; // Read in 1KB chunks
    const buffer = Buffer.alloc(bufferSize);
    let position = Math.max(0, fileSize - bufferSize); // Start from the end

    let lastLine = '';
    let lineFound = false;
    const fd = await fs.open(filePath, 'r'); // Open the file

    const readNextChunk = async () => {
      const { bytesRead } = await fd.read(buffer, 0, bufferSize, position);

      const chunk = buffer.toString('utf-8', 0, bytesRead);
      position -= bufferSize;

      // Split the chunk into lines
      const lines = chunk.split('\n');

      // If we are reading from the end, the last line might be partial
      if (lineFound) {
        lastLine = lines[lines.length - 1] + lastLine; // Combine with the previous line
      } else {
        lastLine = lines.pop() || lastLine; // Last line might still be incomplete
        lineFound = true;
      }

      // Check if we found a full line
      if (lines.length > 1) {
        lastLine = lines[lines.length - 1]; // The last complete line
        await fd.close(); // Close file descriptor
        return lastLine; // Return the last line found
      } else if (position < 0) {
        // We've read all the way to the start
        await fd.close(); // Close file descriptor
        return lastLine; // Return the last line we found
      } else {
        // Read the next chunk
        return readNextChunk();
      }
    };

    return await readNextChunk(); // Start reading chunks
  } catch (err) {
    throw err; // Propagate errors
  }
}

// Usage
readLastRow(filePath)
  .then((lastRow) => {
    console.log('Last row:', lastRow);
  })
  .catch((error) => {
    console.error('Error reading last row:', error);
  });
