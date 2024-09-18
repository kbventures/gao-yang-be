import express, { Request, Response } from 'express';
const app = express()

const port = 3000;

console.log("Testing port env", process.env.PORT)

app.get('/', (req: Request,res:Response)=>{
    res.send('Hello World!')
})