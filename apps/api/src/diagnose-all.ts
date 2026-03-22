import { emailQueue, emailWorker } from './services/queue';
import prisma from './services/db';

async function main() {
  console.log('--- SYSTEM DIAGNOSTIC ---');

  // 1. Check DB
  try {
    const userCount = await prisma.user.count();
    const logCount = await prisma.emailLog.count();
    const sentCount = await prisma.emailLog.count({ where: { status: 'SENT' } });
    console.log(`DB Status: ${userCount} Users, ${logCount} Logs, ${sentCount} Sent`);
    
    const lastLog = await prisma.emailLog.findFirst({ orderBy: { createdAt: 'desc' } });
    if (lastLog) {
      console.log(`Latest Log ID: ${lastLog.id}, Status: ${lastLog.status}, To: ${lastLog.to}`);
    }
  } catch (e) {
    console.error('DB Check Failed:', e);
  }

  // 2. Check Queue
  try {
    const jobCounts = await emailQueue.getJobCounts();
    console.log('Queue Status:', JSON.stringify(jobCounts, null, 2));
  } catch (e) {
    console.error('Queue Check Failed:', e);
  }

  // 3. Check Worker
  console.log('Worker isRunning:', emailWorker.isRunning());
  
  process.exit(0);
}

main();
