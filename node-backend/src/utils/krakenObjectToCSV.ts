import fs from 'fs';
import krakenCurrencyFetch from './krakenApiFetch';

const ohlcvtUpdate = krakenCurrencyFetch(prevQuarterEndDate,interval,pair)

// data to be determined/shaped
const data; 
const csvContent = data.map(row=>row.join(',')).join('\n');


fs.writeFileSync(`${pair}_${interval}`, csvContent,(err:unknown)=>{
    if(err instanceof Error){
        console.error("Error writing to file: ", err, err.message, err.name, err.stack)
    } else {
        throw new Error("Unknown error while writing to file: ")
    }
})

