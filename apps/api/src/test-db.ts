import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing DB connection...');
  try {
    const logs = await prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    console.log('Final Email Logs:');
    logs.forEach(l => console.log(`- To: ${l.to}, Status: ${l.status}, Error: ${l.error ?? 'None'}`));
  } catch (e) {
    console.error('DB Check Failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
