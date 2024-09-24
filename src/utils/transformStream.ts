import { Transform } from 'stream';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


const transformStream = new Transform({
    objectMode: true,
    async transform(row, encoding, callback) {
      const data = {
        // Assuming the CSV columns correspond to these properties
        timestamp: new Date(row[0]),
        open: parseFloat(row[1]),
        high: parseFloat(row[2]),
        low: parseFloat(row[3]),
        close: parseFloat(row[4]),
        volume: parseFloat(row[5]),
        transactionCount: parseInt(row[6], 10),
      };
  
      try {
        await prisma.oHLCVT1.create({ data });
        callback(null, data);
      } catch (error) {
        callback(error);
      }
    }
  });

  export default transformStream;