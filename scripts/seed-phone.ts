import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding default phone numbers...')
  
  const result = await prisma.user.updateMany({
    where: {
      OR: [
        { phone: null },
        { phone: '' }
      ]
    },
    data: {
      phone: '+91 5550123456'
    }
  })
  
  console.log(`Updated ${result.count} users with default phone number.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
