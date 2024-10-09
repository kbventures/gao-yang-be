import fetch from 'node-fetch';
import { OHLCVT } from '../types';

// const pair = "XBTCAD";
// const interval = 1440;
// const since = 1711843200

interface KrakenOHLVCVTResponse {
    result: Record<string, OHLCVT[]>;
    error: string[];
}

const [,,pair,interval,since] = process.argv


// node krakenApiFetch.js XBTCAD 1440 1711843200
const getOHLCVTData = async function(pair:string, interval:string,since:string){
    
    const url = `https://api.kraken.com/0/public/OHLC?pair=${pair}&interval=${parseInt(interval)}&since=${parseInt(since)}`;

    try{
        const response = await(fetch(url))

        if(!response.ok){
            throw new Error("network response was not ok: " + response.statusText)
        }
        const data = await response.json() as KrakenOHLVCVTResponse
        console.dir(data.result.XXBTZCAD, { depth: null });

    }catch(error: unknown){
        if(error instanceof Error){
            console.error("Fetch History Error: ", error.name, error.stack, error.message)
        } else {
            throw new Error("Unknown error!")
        }
    }
}


getOHLCVTData(pair,interval,since)


// Equivalen Curl Command: 

// curl -X GET "https://api.kraken.com/0/public/OHLC?pair=XBTCAD&interval=1440&since=1711843200" \
//      -H "Content-Type: application/json"

