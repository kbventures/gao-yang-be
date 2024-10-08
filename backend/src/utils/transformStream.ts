import { Transform } from 'stream';
import { OHLCVT } from '../types';

// type NextFunction = (error?:Error)=>void;

export function myTransformStream(
  updateGlobalVariables: (data: OHLCVT) => void
) {
  const newTransform = new Transform({
    objectMode: true,
    async transform(row, encoding, callback) {
      try {
        const data = {
          // Assuming the CSV columns correspond to these properties
          timestamp: new Date(row[0] * 1000),
          open: Number(row[1]),
          high: Number(row[2]),
          low: Number(row[3]),
          close: Number(row[4]),
          volume: Number(row[5]),
          transactionCount: Number(row[6]),
        };
        await updateGlobalVariables(data);
        callback(null, data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error processing row:', row, error); // Log the error
          callback(error); // Pass the error to the callback to handle i
        } else {
          callback(new Error('Unknown error occured'));
        }
      }
    },
  });
  return newTransform;
}
