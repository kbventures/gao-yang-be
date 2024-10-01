import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCurrencyPair = async (pair: string) => {
  try {
    const currencyPair = await prisma.currencyPair.create({
      data: {
        pair,
      },
    });
    return currencyPair;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect;
  }
};

export const deleteCurrencyPair = async (pairId: string) => {
  try {
    const deletedPair = prisma.currencyPair.delete({
      where: { id: pairId },
    });
    console.log('Currency pair successfully delete: ', deletedPair);
  } finally {
    await prisma.$disconnect();
  }
};
