import { emailQueue } from './services/queue';

async function main() {
  const waiting = await emailQueue.getWaiting();
  const active = await emailQueue.getActive();
  const completed = await emailQueue.getCompleted();
  const failed = await emailQueue.getFailed();

  console.log('Queue Status:');
  console.log('Waiting:', waiting.length);
  console.log('Active:', active.length);
  console.log('Completed:', completed.length);
  console.log('Failed:', failed.length);

  if (waiting.length > 0) {
    console.log('Sample waiting job:', JSON.stringify(waiting[0].data, null, 2));
  }

  process.exit(0);
}

main();
