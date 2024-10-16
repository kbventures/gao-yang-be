import fetch from 'node-fetch';
import { KrakenResponse, TickDataArray } from '../types/index';

export const getKrakenOHLCVVTData = async function (
  pair: string,
  interval: string,
  since: string
) {
  const url = `https://api.kraken.com/0/public/OHLC?pair=${pair}&interval=${parseInt(interval)}&since=${parseInt(since)}`;

  try {
    const response = await fetch(url);
    console.log(response);

    if (!response.ok) {
      throw new Error('network response was not ok: ' + response.statusText);
    }
    const data = (await response.json()) as KrakenResponse;
    console.dir(data.result.XXBTZCAD, { depth: null });

    const tickDataArray: TickDataArray[] = data.result.XXBTZCAD.map((item) => [
      Number(item[0]), // Timestamp
      item[1], // Open price
      item[2], // High price
      item[3], // Low price
      item[4], // Close price
      item[5], // VWAP price
      item[6], // Volume
      Number(item[7]), // Transaction count
    ]);

    return tickDataArray;
    // return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        'Fetch History Error: ',
        error.name,
        error.stack,
        error.message
      );
    } else {
      throw new Error('Unknown error!');
    }
  }
};

// https://docs.kraken.com/api/docs/rest-api/get-ohlc-data

// Equivalen Curl Command:

// curl -X GET "https://api.kraken.com/0/public/OHLC?pair=XBTCAD&interval=1440&since=1711843200" \
//      -H "Content-Type: application/json"

// Array of tick data arrays [int <time>, string <open>, string <high>, string <low>, string <close>, string <vwap>, string <volume>, int <count>]
// [
//   1720483200,
//   '77373.9',
//   '79392.4',
//   '76722.1',
//   '79122.3',
//   '78396.1',
//   '15.07409206',
//   1152
// ],
// ... 98 more items
// ]

// interface OHLVCT {
//   timestamp: number; // Assuming this is the correct field
//   time: number;
//   open: string;
//   high: string;
//   low: string;
//   close: string;
//   volume: string;
//   transactionCount: number;
// }

// interface KrakenOHLVCVTResponse {
//   result: Record<string, Array<number | string>>;
//   error: string[];
// }

// export const getKrakenOHLCVTData = async function (
//   pair: string,
//   interval: string,
//   since: string
// ): Promise<OHLVCT[]> {
//   const url = `https://api.kraken.com/0/public/OHLC?pair=${pair}&interval=${parseInt(interval)}&since=${parseInt(since)}`;

//   try {
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error('Network response was not ok: ' + response.statusText);
//     }

//     const data = (await response.json()) as KrakenOHLVCVTResponse;
//     const ohlcData = data.result[pair];

//     // Map to OHLVCT[]
//     const ohlvctArray: OHLVCT[] = ohlcData.map((ohlc: any) => ({
//       timestamp: ohlc[0],           // Time in seconds since epoch
//       time: ohlc[0],                // You might keep only one of these
//       open: ohlc[1],
//       high: ohlc[2],
//       low: ohlc[3],
//       close: ohlc[4],
//       volume: ohlc[6],
//       transactionCount: ohlc[7] || 0, // Adjust based on actual data
//     }));

//     console.dir(ohlvctArray, { depth: null });
//     return ohlvctArray;
//   } catch (error) {
//     console.error('Fetch History Error:', error);
//     throw new Error('Error fetching OHLC data');
//   }
// };

// interface OHLVCT {
//   timestamp: number; // Assuming this is the correct field
//   time: number;
//   open: string;
//   high: string;
//   low: string;
//   close: string;
//   volume: string;
//   transactionCount: number;
// }

// interface KrakenOHLVCVTResponse {
//   result: Record<string, Array<number | string>>;
//   error: string[];
// }

// export const getKrakenOHLCVTData = async function (
//   pair: string,
//   interval: string,
//   since: string
// ): Promise<OHLVCT[]> {
//   const url = `https://api.kraken.com/0/public/OHLC?pair=${pair}&interval=${parseInt(interval)}&since=${parseInt(since)}`;

//   try {
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error('Network response was not ok: ' + response.statusText);
//     }

//     const data = (await response.json()) as KrakenOHLVCVTResponse;
//     const ohlcData = data.result[pair];

//     // Map to OHLVCT[]
//     const ohlvctArray: OHLVCT[] = ohlcData.map((ohlc: any) => ({
//       timestamp: ohlc[0],           // Time in seconds since epoch
//       time: ohlc[0],                // You might keep only one of these
//       open: ohlc[1],
//       high: ohlc[2],
//       low: ohlc[3],
//       close: ohlc[4],
//       volume: ohlc[6],
//       transactionCount: ohlc[7] || 0, // Adjust based on actual data
//     }));

//     console.dir(ohlvctArray, { depth: null });
//     return ohlvctArray;
//   } catch (error) {
//     console.error('Fetch History Error:', error);
//     throw new Error('Error fetching OHLC data');
//   }
// };
