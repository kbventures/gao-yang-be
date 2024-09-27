import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createCurrencyPair = async (id: string) => {
  try {
    const currencyPair = await prisma.currencyPair.create({
      data: {
        id,
      },
    });
    return currencyPair;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect;
  }
};
