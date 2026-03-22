const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findUnique({
    where: { apiKey: 'test_api_key_123' }
  });
  console.log('USER_CHECK:', user ? 'FOUND' : 'NOT_FOUND');
  if (user) console.log('USER_EMAIL:', user.email);
  const domains = await prisma.domain.findMany();
  console.log('DOMAINS_COUNT:', domains.length);
  process.exit(0);
}

check();
