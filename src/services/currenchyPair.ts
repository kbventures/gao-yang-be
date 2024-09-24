import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const currencyPair = await prisma.currencyPair.create({
  data: {
    id: 'XBTCAD',
  },
});
