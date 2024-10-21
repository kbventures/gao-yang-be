import obtainLastRowCsv from './obtainLastRowCsvUtil.js';

const [, , pair, interval, filePath] = process.argv;

// This utility will orchestrate the use of utilities and or services required to sync the historical data to csv and sql

// 1 obtain last csv entry from pair interval you wish to update
// 2 utilise this entry timestamp to obtain history through api call necessary to update the history
// 3 Update the csv file and sql database

// Future steps
// All Intervals of one pair
// Clean/ Maintain data integrity util
// Automate updates
// All intenrvals of all pairs
// Testing
