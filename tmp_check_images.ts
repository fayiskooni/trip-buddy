import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const images = await prisma.tripImage.findMany();
  console.log("Trip Images in DB:");
  console.log(images);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
