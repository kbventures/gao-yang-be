import fs from 'fs';
import path from 'path';

// Function to extract pair names
function extractPairsFromFiles(directoryPath) {
  // Read all files in the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Filter out the .csv files and extract the pair names
    const pairs = files
      .filter(file => file.endsWith('.csv')) // Ensure it's a CSV file
      .map(file => {
        const pair = file.replace(/_\d+\.csv$/, ''); // Remove the _timeframe.csv part
        return pair;
      });

    // Write the pair names to a new file
    const outputFilePath = path.join(directoryPath, 'pairs.txt');
    fs.writeFile(outputFilePath, pairs.join('\n'), (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Pair names saved to', outputFilePath);
      }
    });
  });
}

// Specify the directory where your CSV files are located
const directoryPath = './your-directory-path'; // Change this to your directory path
extractPairsFromFiles(directoryPath);
