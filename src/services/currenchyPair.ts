import { PrismaClient } from 'Prisma'; 

const prisma = new PrismaClient();

const currencyPair = await prisma.currencyPair.create({
    data:{
        id: "XBTCAD",
    }
})