import { Router, Request, Response } from 'express';
import prisma from '../services/db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  console.log('Stats request for user:', user?.id);

  try {
    // 1. Get total emails sent
    const totalSent = await prisma.emailLog.count({
      where: { userId: user.id },
    });

    // 2. Get success rate
    const successful = await prisma.emailLog.count({
      where: { 
        userId: user.id,
        status: 'SENT'
      },
    });

    const successRate = totalSent === 0 ? 100 : Math.round((successful / totalSent) * 100);

    // 3. Get pending/failed
    const pending = await prisma.emailLog.count({
      where: { 
        userId: user.id,
        status: 'PENDING'
      },
    });

    const failed = await prisma.emailLog.count({
      where: { 
        userId: user.id,
        status: 'FAILED'
      },
    });

    // 4. Get recent logs
    const recentLogs = await prisma.emailLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // 5. Get domains count
    const domainsCount = await prisma.domain.count({
      where: { userId: user.id },
    });

    // 6. Get SMS and WhatsApp counts
    const smsCount = await prisma.smsLog.count({
      where: { userId: user.id, status: 'SENT' },
    });
    const waCount = await prisma.whatsAppLog.count({
      where: { userId: user.id, status: 'SENT' },
    });

    res.json({
      totalSent,
      successRate,
      pending,
      failed,
      domainsCount,
      smsCount,
      waCount,
      recentLogs: recentLogs.map((log: any) => ({
        id: log.id,
        to: log.to,
        subject: log.subject,
        html: log.html,
        status: log.status,
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: (error as any).message,
      stack: (error as any).stack 
    });
  }
});

export default router;
