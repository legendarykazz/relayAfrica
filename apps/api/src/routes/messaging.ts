import { Router, Request, Response } from 'express';
import { sendSms, sendWhatsApp } from '../services/messaging';
import prisma from '../services/db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// SMS Route
router.post('/sms', authMiddleware, async (req: Request, res: Response) => {
  const { to, message } = req.body;
  const user = (req as any).user;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing recipient or message' });
  }

  try {
    const log = await prisma.smsLog.create({
      data: {
        userId: user.id,
        to,
        message,
        status: 'PENDING'
      }
    });

    try {
      await sendSms(to, message);
      await prisma.smsLog.update({
        where: { id: log.id },
        data: { status: 'SENT' }
      });
      res.json({ success: true, logId: log.id });
    } catch (error: any) {
      await prisma.smsLog.update({
        where: { id: log.id },
        data: { status: 'FAILED', error: error.message }
      });
      res.status(500).json({ error: error.message });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// WhatsApp Route
router.post('/whatsapp', authMiddleware, async (req: Request, res: Response) => {
  const { to, message } = req.body;
  const user = (req as any).user;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing recipient or message' });
  }

  try {
    const log = await prisma.whatsAppLog.create({
      data: {
        userId: user.id,
        to,
        message,
        status: 'PENDING'
      }
    });

    try {
      await sendWhatsApp(to, message);
      await prisma.whatsAppLog.update({
        where: { id: log.id },
        data: { status: 'SENT' }
      });
      res.json({ success: true, logId: log.id });
    } catch (error: any) {
      await prisma.whatsAppLog.update({
        where: { id: log.id },
        data: { status: 'FAILED', error: error.message }
      });
      res.status(500).json({ error: error.message });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
