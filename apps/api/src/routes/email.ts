import { Router, Request, Response } from 'express';
import { emailQueue } from '../services/queue';
import { authMiddleware } from '../middleware/auth';
import prisma from '../services/db';

const router = Router();

router.post('/send', authMiddleware, async (req: Request, res: Response) => {
  const { to, subject, html } = req.body;
  const user = (req as any).user;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  try {
    // 1. Create a log entry for the email
    const log = await prisma.emailLog.create({
      data: {
        userId: user.id,
        to,
        subject,
        html,
        status: 'PENDING',
      },
    });

    // 2. Add email to the queue
    await emailQueue.add('send-email', {
      logId: log.id,
      to,
      subject,
      html,
    });

    res.status(202).json({
      message: 'Email queued successfully',
      logId: log.id,
    });
  } catch (error) {
    console.error('Send Email API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
