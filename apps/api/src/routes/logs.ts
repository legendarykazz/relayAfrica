import { Router, Request, Response } from 'express';
import prisma from '../services/db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

console.log('--- LOGS_ROUTER_LOADED ---');

// Get paginated Email Logs
router.get('/email', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [logs, total] = await Promise.all([
      prisma.emailLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.emailLog.count({
        where: { userId: user.id },
      }),
    ]);

    res.json({
      logs: logs.map((log: any) => ({
        id: log.id,
        to: log.to,
        subject: log.subject,
        html: log.html,
        status: log.status,
        createdAt: log.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

// Get paginated SMS Logs
router.get('/sms', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [logs, total] = await Promise.all([
      prisma.smsLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.smsLog.count({
        where: { userId: user.id },
      }),
    ]);

    res.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SMS logs' });
  }
});

// Get paginated WhatsApp Logs
router.get('/whatsapp', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const [logs, total] = await Promise.all([
      prisma.whatsAppLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.whatsAppLog.count({
        where: { userId: user.id },
      }),
    ]);

    res.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch WhatsApp logs' });
  }
});

export default router;
