import { emailQueue } from './services/queue';
import prisma from './services/db';

async function main() {
  console.log('Adding test email to queue...');
  
  // 1. Fetch any user
  const user = await prisma.user.findFirst();
  if (!user) throw new Error('No user found in DB');
  console.log('Using user:', user.email);

  // 2. Create log entry
  const log = await prisma.emailLog.create({
    data: {
      userId: user.id,
      to: 'amjustsam28@gmail.com',
      subject: 'Relay Africa Worker Test',
      html: '<p>Worker test successful!</p>',
      status: 'PENDING',
    },
  });

  // 2. Add to queue
  await emailQueue.add('send-email', {
    logId: log.id,
    to: 'amjustsam28@gmail.com',
    subject: 'Relay Africa Worker Test',
    html: '<p>Worker test successful!</p>',
  });

  console.log(`Job added with Log ID: ${log.id}`);
  process.exit(0);
}

main();
