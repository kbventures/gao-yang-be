import fs from 'fs';
import path from 'path';

// Path to your CSV file
const filePath = path.join(
  '/home/ken/Programming/gao-yang-be/node-data-sync/historical-data/Kraken_OHLCVT/XBTCAD/XBTCAD_1440.csv'
);

// Start time
const startTime = Date.now();

// Create a readable stream
const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

// Variable to keep track of data chunks
let lastLine = '';
let data = '';

// Read the stream
stream.on('data', (chunk: string) => {
  data += chunk; // Accumulate the data chunk
});

// When the stream ends
stream.on('end', () => {
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000; // Convert milliseconds to seconds

  // Split data into lines and get the last line
  const lines = data.trim().split('\n');
  lastLine = lines[lines.length - 1];

  console.log(`Finished reading the file in ${duration} seconds`);
  console.log(`Last row: ${lastLine}`);
});

// Handle errors
stream.on('error', (err: any) => {
  console.error('Error reading the file:', err);
});

// 10/21/2024
// tests-utils$ node csvReadingSpeed.js
// Finished reading the file in 0.003 seconds
// Last row: 1711843200,94915.8,96636.9,94890.3,96526.9,18.15392732,1241
