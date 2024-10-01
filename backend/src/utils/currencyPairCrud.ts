import { PrismaClient} from '@prisma/client';

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

const command = process.argv[0];
const id = process.argv[1];

if (command === 'create') {
  createCurrencyPair(id);
} else if (command === 'delete') {
  deleteCurrencyPair(id);
} else {
  console.log('Invalid command! Use create or delete');
}
