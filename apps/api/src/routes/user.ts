import { Router, Request, Response } from 'express';
import prisma from '../services/db';
import { authMiddleware } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();

// Get current user profile (including API key)
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    id: user.id,
    email: user.email,
    apiKey: user.apiKey,
    createdAt: user.createdAt,
  });
});

// Rotate API Key
router.post('/rotate-key', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { apiKey: crypto.randomUUID() },
    });

    res.json({
      message: 'API Key rotated successfully',
      apiKey: updatedUser.apiKey,
    });
  } catch (error) {
    console.error('User API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: (error as any).message
    });
  }
});

export default router;
