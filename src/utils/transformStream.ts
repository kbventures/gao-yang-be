import { Transform } from 'stream';
import { OHLCVT1 } from '../models/OHLCVT'
import Decimal from "decimal.js"

function myTransformStream(currentChunks: OHLCVT1, currentChunkCount: number){

const newTransform =  new Transform({
    objectMode: true,
    async transform(row, encoding, callback) {
      const data = {
        // Assuming the CSV columns correspond to these properties
        timestamp: new Date(row[0]),
        open: new Decimal(row[1]),
        high: new Decimal(row[2]),
        low: new Decimal(row[3]),
        close: new Decimal(row[4]),
        volume: new Decimal(row[5]),
        transactionCount: new Decimal(row[6]),
      }
    },
})

currentChunkCount++
}

module.exports = { myTransformStream }