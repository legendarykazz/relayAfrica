"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailWorker = exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const client_ses_1 = require("@aws-sdk/client-ses");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config();
const sesClient = new client_ses_1.SESClient({
    region: process.env.AWS_REGION || "af-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    }
});
const connection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});
exports.emailQueue = new bullmq_1.Queue('email-queue', { connection });
exports.emailWorker = new bullmq_1.Worker('email-queue', async (job) => {
    const { logId, to, subject, html } = job.data;
    console.log(`Processing email to ${to} with subject: ${subject}`);
    try {
        if (!process.env.AWS_ACCESS_KEY_ID) {
            throw new Error('AWS_ACCESS_KEY_ID is missing');
        }
        const command = new client_ses_1.SendEmailCommand({
            Destination: { ToAddresses: [to] },
            Message: {
                Body: {
                    Html: { Charset: "UTF-8", Data: html },
                    Text: { Charset: "UTF-8", Data: html.replace(/<[^>]*>?/gm, '') }
                },
                Subject: { Charset: "UTF-8", Data: subject },
            },
            Source: process.env.AWS_SES_FROM_ADDRESS || 'Relay Africa <hello@relayafrica.com>',
        });
        const data = await sesClient.send(command);
        // 2. Update log status to SENT
        console.log(`Updating DB to SENT for Log ID: ${logId}`);
        const updated = await db_1.default.emailLog.update({
            where: { id: logId },
            data: { status: 'SENT' }
        });
        console.log(`DB Update Result:`, updated.status);
        console.log(`Email sent successfully to ${to} (Log ID: ${logId})`);
        return { success: true, messageId: data?.MessageId };
    }
    catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        // Update DB to failed if we haven't already
        try {
            await db_1.default.emailLog.update({
                where: { id: logId },
                data: { status: 'FAILED', error: error.message }
            });
        }
        catch (dbError) {
            console.error('Failed to update DB status:', dbError);
        }
        throw error;
    }
}, { connection });
exports.emailWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});
exports.emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
