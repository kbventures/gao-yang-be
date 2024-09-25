import { Transform } from 'stream';
import { OHLCVT } from '../types/index';

interface ChunkCount {
  count: number
}

export default function myTransformStream(
  currentChunks: OHLCVT[],
  currentChunkCount: ChunkCount
) {
  const newTransform = new Transform({
    objectMode: true,
    async transform(row, encoding, callback) {
      const data = {
        // Assuming the CSV columns correspond to these properties
        timestamp: new Date(row[0]),
        open: Number(row[1]),
        high: Number(row[2]),
        low: Number(row[3]),
        close: Number(row[4]),
        volume: Number(row[5]),
        transactionCount: Number(row[6]),
      };
      currentChunks.push(data);
      currentChunkCount.count;
      callback(null, data);
    },
  });

  return newTransform;
}

module.exports = { myTransformStream };
