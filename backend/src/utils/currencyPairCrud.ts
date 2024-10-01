import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCurrencyPair = async (pair: string) => {
  try {
    const currencyPair = await prisma.currencyPair.create({
      data: {
        pair:pair, 
      },
    });
    return currencyPair;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteCurrencyPair = async (pair: string) => {
  try {
    const deletedPair = await prisma.currencyPair.delete({
      where: { pair: pair },
    });
    console.log('Currency pair successfully delete: ', deletedPair);
  } finally {
    await prisma.$disconnect();
  }
};

export const getCurrencyPairs = async ()=>{
  try {
    const currencyPairs = await prisma.currencyPair.findMany()
    console.log("Currency pairs: ",currencyPairs)
  } finally {
    await prisma.$disconnect();
  }
}
const command = process.argv[2];
const pair = process.argv[3];


if (command === 'create') {
  createCurrencyPair(pair);
} else if (command === 'delete') {
  deleteCurrencyPair(pair);
} else if (command === 'get') {
  getCurrencyPairs()
} else {
  console.log('Invalid command! Use create, get or delete');
}
