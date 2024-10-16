import fs from 'fs/promises';

const [, , pair, interval, sinc, filePath]: string[] = process.argv;

export async function readLastRow(filePath: string): Promise<string> {
  try {
    const stats = await fs.stat(filePath); // Get file stats
    const fileSize = stats.size; // File size in bytes
    const bufferSize = 1024; // Read in 1KB chunks
    const buffer = Buffer.alloc(bufferSize); // Allocate buffer
    let position = Math.max(0, fileSize - bufferSize); // Start from the end

    let lastLine = '';
    let lineFound = false;

    const fd = await fs.open(filePath, 'r'); // Open the file

    const readNextChunk = async (): Promise<string> => {
      const { bytesRead } = await fd.read(buffer, 0, bufferSize, position); // Read from file

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
        return readNextChunk(); // Recursive call
      }
    };

    const result = await readNextChunk(); // Start reading chunks
    await fd.close(); // Close the file descriptor
    return result; // Return the final result
  } catch (err) {
    throw err; // Propagate errors
  }
}

// Usage with async/await
(async () => {
  try {
    const lastRow = await readLastRow(filePath);
    console.log('Last row:', lastRow);
  } catch (error) {
    console.error('Error reading last row:', error);
  }
})();





// import fs from 'fs';

// const [, , pair, interval, sinc, filePath]: string[] = process.argv;

// export function readLastRow(filePath: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     fs.stat(filePath, (err, stats) => {
//       if (err) {
//         return reject(err);
//       }
//       // file size in bytes
//       const fileSize = stats.size;
//       const bufferSize = 1024; // Read in 1KB chunks
//       const buffer = Buffer.alloc(bufferSize);
//       let position = Math.max(0, fileSize - bufferSize); // Start from the end

//       let lastLine = '';
//       let lineFound = false;
//       let fd: number; // Declare fd here

//       const readNextChunk = () => {
//         fs.read(fd, buffer, 0, bufferSize, position, (err, bytesRead) => {
//           if (err) {
//             return reject(err);
//           }

//           const chunk = buffer.toString('utf-8', 0, bytesRead);
//           position -= bufferSize;

//           // Split the chunk into lines
//           const lines = chunk.split('\n');

//           // If we are reading from the end, the last line might be partial
//           if (lineFound) {
//             lastLine = lines[lines.length - 1] + lastLine; // Combine with the previous line
//           } else {
//             lastLine = lines.pop() || lastLine; // Last line might still be incomplete
//             lineFound = true;
//           }

//           // Check if we found a full line
//           if (lines.length > 1) {
//             lastLine = lines[lines.length - 1]; // The last complete line
//             resolve(lastLine);
//             fs.close(fd, () => {}); // Close file descriptor
//           } else if (position < 0) {
//             // We've read all the way to the start
//             resolve(lastLine); // Return the last line we found
//             fs.close(fd, () => {}); // Close file descriptor
//           } else {
//             // Read the next chunk
//             readNextChunk();
//           }
//         });
//       };



//       // Open the file for reading
//       fs.open(filePath, 'r', (err, openedFd) => {
//         if (err) {
//           return reject(err);
//         }
//         fd = openedFd; // Assign the opened file descriptor
//         readNextChunk();
//       });


//     });
//   });
// }

// // Usage
// readLastRow(filePath)
//   .then((lastRow) => {
//     console.log('Last row:', lastRow);
//   })
//   .catch((error) => {
//     console.error('Error reading last row:', error);
//   });

