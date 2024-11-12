import express, { Request, Response } from 'express';
const app = express();
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

console.log('Testing port env', process.env.PORT);
const port = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

try {
  app.listen(port, () => {
    console.log(`Server running on port: `, port);
  });
} catch (err) {
  if (err instanceof Error) {
    console.log(err.message);
    console.log(err.stack);
    console.log(err.name);
  } else {
    console.log('Unexpected Error: ', err);
  }
}
