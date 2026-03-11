import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.tripImage.deleteMany({
    where: {
      OR: [
        { imageUrl: { contains: 'unsplash.com' } },
        { imageUrl: { contains: 'loremflickr.com' } },
      ]
    }
  });
  console.log(`Deleted ${result.count} fake images`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
