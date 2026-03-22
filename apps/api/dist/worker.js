"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const queue_1 = require("./services/queue");
console.log('--- EMAIL WORKER STARTED ---');
queue_1.emailWorker.on('active', (job) => {
    console.log(`Job ${job.id} is now active`);
});
queue_1.emailWorker.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed:`, result);
});
queue_1.emailWorker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} failed:`, err.message);
});
process.on('SIGTERM', async () => {
    await queue_1.emailWorker.close();
    process.exit(0);
});
