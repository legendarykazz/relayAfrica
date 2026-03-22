"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("./services/queue");
async function main() {
    const waiting = await queue_1.emailQueue.getWaiting();
    const active = await queue_1.emailQueue.getActive();
    const completed = await queue_1.emailQueue.getCompleted();
    const failed = await queue_1.emailQueue.getFailed();
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
