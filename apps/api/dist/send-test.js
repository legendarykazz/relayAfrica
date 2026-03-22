"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("./services/queue");
const db_1 = __importDefault(require("./services/db"));
async function main() {
    console.log('Adding test email to queue...');
    // 1. Fetch any user
    const user = await db_1.default.user.findFirst();
    if (!user)
        throw new Error('No user found in DB');
    console.log('Using user:', user.email);
    // 2. Create log entry
    const log = await db_1.default.emailLog.create({
        data: {
            userId: user.id,
            to: 'amjustsam28@gmail.com',
            subject: 'Relay Africa Worker Test',
            html: '<p>Worker test successful!</p>',
            status: 'PENDING',
        },
    });
    // 2. Add to queue
    await queue_1.emailQueue.add('send-email', {
        logId: log.id,
        to: 'amjustsam28@gmail.com',
        subject: 'Relay Africa Worker Test',
        html: '<p>Worker test successful!</p>',
    });
    console.log(`Job added with Log ID: ${log.id}`);
    process.exit(0);
}
main();
