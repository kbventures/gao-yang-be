import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main(){
    const allOhlcvtData = await prisma.oHLCVT.findMany()
    console.log("allOhlcvtData,", allOhlcvtData)
}


main().catch((e)=>{
    console.log(e);
    process.exit(1);
}).finally(async()=>{
    await prisma.$disconnect;
})