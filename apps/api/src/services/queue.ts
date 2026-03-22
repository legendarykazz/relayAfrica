import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from 'dotenv';
import prisma from './db';

dotenv.config();

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "af-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
}) as any;

export const emailQueue = new Queue('email-queue', { connection });

export const emailWorker = new Worker(
  'email-queue',
  async (job: Job) => {
    const { logId, to, subject, html, from } = job.data;
    console.log(`Processing email to ${to} with subject: ${subject} (From: ${from || 'default'})`);
    
    try {
      if (!process.env.AWS_ACCESS_KEY_ID) {
        throw new Error('AWS_ACCESS_KEY_ID is missing');
      }

      const command = new SendEmailCommand({
        Destination: { ToAddresses: [to] },
        Message: {
          Body: {
            Html: { Charset: "UTF-8", Data: html },
            Text: { Charset: "UTF-8", Data: html.replace(/<[^>]*>?/gm, '') }
          },
          Subject: { Charset: "UTF-8", Data: subject },
        },
        Source: from || process.env.AWS_SES_FROM_ADDRESS || 'Relay Africa <hello@relayafrica.com>',
      });

      const data = await sesClient.send(command);

      // 2. Update log status to SENT
      console.log(`Updating DB to SENT for Log ID: ${logId}`);
      const updated = await prisma.emailLog.update({
        where: { id: logId },
        data: { status: 'SENT' }
      });
      console.log(`DB Update Result:`, updated.status);

      console.log(`Email sent successfully to ${to} (Log ID: ${logId})`);
      return { success: true, messageId: data?.MessageId };
    } catch (error: any) {
      console.error(`Failed to send email to ${to}:`, error);
      
      // Update DB to failed if we haven't already
      try {
        await prisma.emailLog.update({
          where: { id: logId },
          data: { status: 'FAILED', error: error.message }
        });
      } catch (dbError) {
        console.error('Failed to update DB status:', dbError);
      }
      
      throw error;
    }
  },
  { connection }
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
