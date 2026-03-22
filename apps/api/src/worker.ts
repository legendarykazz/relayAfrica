import 'dotenv/config';
import { emailWorker } from './services/queue';

console.log('--- EMAIL WORKER STARTED ---');

emailWorker.on('active', (job) => {
  console.log(`Job ${job.id} is now active`);
});

emailWorker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

emailWorker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed:`, err.message);
});

process.on('SIGTERM', async () => {
  await emailWorker.close();
  process.exit(0);
});
