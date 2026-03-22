import { Router, Request, Response } from 'express';
import { emailQueue } from '../services/queue';
import { authMiddleware } from '../middleware/auth';
import prisma from '../services/db';

const router = Router();

router.post('/send', authMiddleware, async (req: Request, res: Response) => {
  const { to, subject, html, from } = req.body;
  const user = (req as any).user;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  try {
    // 1. If 'from' is provided, verify domain ownership
    let senderEmail = 'noreply@relay.africa';
    if (from) {
      const fromDomain = from.split('@')[1];
      if (!fromDomain) return res.status(400).json({ error: 'Invalid from address format' });

      const verifiedDomain = await prisma.domain.findFirst({
        where: {
          userId: user.id,
          name: fromDomain,
          verifiedAt: { not: null }
        }
      });

      if (!verifiedDomain) {
        return res.status(403).json({ 
          error: `Domain '${fromDomain}' is not verified. Please verify it in your dashboard first.` 
        });
      }
      senderEmail = from;
    }

    // 2. Create a log entry for the email
    const log = await prisma.emailLog.create({
      data: {
        userId: user.id,
        to,
        subject,
        html,
        status: 'PENDING',
      },
    });

    // 3. Add email to the queue with the optional sender
    await emailQueue.add('send-email', {
      logId: log.id,
      to,
      subject,
      html,
      from: senderEmail
    });

    res.status(202).json({
      message: 'Email queued successfully',
      logId: log.id,
      from: senderEmail
    });
  } catch (error) {
    console.error('Send Email API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
