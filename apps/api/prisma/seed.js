const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@relayafrica.com' },
    update: {},
    create: {
      email: 'test@relayafrica.com',
      apiKey: 'test_api_key_123',
    },
  });

  console.log('✅ Seeded successfully!');
  console.log('---');
  console.log('User Email:', user.email);
  console.log('Test API Key:', user.apiKey);
  console.log('---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
