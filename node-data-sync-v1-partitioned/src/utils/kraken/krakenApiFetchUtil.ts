import fetch from 'node-fetch';
import { KrakenResponse, TickDataArray } from '../../types/index.js';

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

// const pair = "XBTCAD";
// const interval = 1440;
// const since = 1711843200

// node krakenApiFetch.js XBTCAD 1440 1711843200
const getKrakenOHLCVVTData = async function (
  pair: string,
  interval: string,
  since: string
) {
  const url = `https://api.kraken.com/0/public/OHLC?pair=${pair}&interval=${parseInt(interval)}&since=${parseInt(since)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('network response was not ok: ' + response.statusText);
    }
    const data = (await response.json()) as KrakenResponse;

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

    console.log(tickDataArray);
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

const [, , pair, interval, since] = process.argv;
getKrakenOHLCVVTData(pair, interval, since);
