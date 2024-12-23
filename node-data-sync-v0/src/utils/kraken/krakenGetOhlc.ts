import fetch from 'node-fetch';
import { KrakenResponse, TickDataArray } from '../../types/index.js';

// When using the Kraken OHLC (Open, High, Low, Close) API, the since parameter is exclusive.
// This means that if you specify a timestamp for a particular date, the data returned will not include that date but will start from the next available timestamp.

export const getKrakenOHLCVVTData = async function (
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
