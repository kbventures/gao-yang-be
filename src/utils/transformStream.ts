import { Transform } from 'stream';
import { OHLCVT } from '../types';

function myTransformStream(updateGlobalVariables:(data: OHLCVT) => void
) {
  const newTransform = new Transform({
    objectMode: true,
    async transform(row, encoding, callback) {
      const data = {
        // Assuming the CSV columns correspond to these properties
        timestamp: new Date(row[0]*1000),
        open: Number(row[1]),
        high: Number(row[2]),
        low: Number(row[3]),
        close: Number(row[4]),
        volume: Number(row[5]),
        transactionCount: Number(row[6]),
      };
      // currentChunks.push(data);
      // console.log(data)
      // console.log(currentChunks)
      // currentChunkCount.count++;
      updateGlobalVariables(data);
      callback(null, data);
    },
  });
  return newTransform;
}

export default myTransformStream;
