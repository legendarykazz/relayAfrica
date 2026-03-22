import prisma from './db';
import { sendSms, sendWhatsApp } from './messaging';
import { emailQueue } from './queue';
import crypto from 'crypto';

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const createAndSendOtp = async (to: string, channel: 'email' | 'sms' | 'whatsapp', userId: string) => {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // 1. Store in DB
  await prisma.otp.create({
    data: {
      to,
      code,
      expiresAt
    }
  });

  const message = `Your Relay Africa verification code is: ${code}. Valid for 5 minutes.`;

  // 2. Send via channel
  if (channel === 'sms') {
    const log = await prisma.smsLog.create({
      data: { userId, to, message, status: 'PENDING' }
    });
    try {
      await sendSms(to, message);
      await prisma.smsLog.update({ where: { id: log.id }, data: { status: 'SENT' } });
      return { success: true };
    } catch (e: any) {
      await prisma.smsLog.update({ where: { id: log.id }, data: { status: 'FAILED', error: e.message } });
      throw e;
    }
  } else if (channel === 'whatsapp') {
    const log = await prisma.whatsAppLog.create({
      data: { userId, to, message, status: 'PENDING' }
    });
    try {
      await sendWhatsApp(to, message);
      await prisma.whatsAppLog.update({ where: { id: log.id }, data: { status: 'SENT' } });
      return { success: true };
    } catch (e: any) {
      await prisma.whatsAppLog.update({ where: { id: log.id }, data: { status: 'FAILED', error: e.message } });
      throw e;
    }
  } else {
    // For email, we need to create a log and queue it
    const log = await prisma.emailLog.create({
      data: {
        userId,
        to,
        subject: 'Verification Code',
        html: `<h1>${code}</h1><p>${message}</p>`,
        status: 'PENDING'
      }
    });

    return emailQueue.add('send-email', {
      logId: log.id,
      to,
      subject: 'Verification Code',
      html: `<h1>${code}</h1><p>${message}</p>`
    });
  }
};

export const verifyOtp = async (to: string, code: string) => {
  const otp = await prisma.otp.findFirst({
    where: {
      to,
      code,
      verified: false,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!otp) return false;

  await prisma.otp.update({
    where: { id: otp.id },
    data: { verified: true }
  });

  return true;
};
