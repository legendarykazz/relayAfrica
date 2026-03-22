"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("./services/queue");
const db_1 = __importDefault(require("./services/db"));
async function main() {
    console.log('--- SYSTEM DIAGNOSTIC ---');
    // 1. Check DB
    try {
        const userCount = await db_1.default.user.count();
        const logCount = await db_1.default.emailLog.count();
        const sentCount = await db_1.default.emailLog.count({ where: { status: 'SENT' } });
        console.log(`DB Status: ${userCount} Users, ${logCount} Logs, ${sentCount} Sent`);
        const lastLog = await db_1.default.emailLog.findFirst({ orderBy: { createdAt: 'desc' } });
        if (lastLog) {
            console.log(`Latest Log ID: ${lastLog.id}, Status: ${lastLog.status}, To: ${lastLog.to}`);
        }
    }
    catch (e) {
        console.error('DB Check Failed:', e);
    }
    // 2. Check Queue
    try {
        const jobCounts = await queue_1.emailQueue.getJobCounts();
        console.log('Queue Status:', JSON.stringify(jobCounts, null, 2));
    }
    catch (e) {
        console.error('Queue Check Failed:', e);
    }
    // 3. Check Worker
    console.log('Worker isRunning:', queue_1.emailWorker.isRunning());
    process.exit(0);
}
main();
