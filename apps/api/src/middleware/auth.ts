import { Request, Response, NextFunction } from 'express';
import prisma from '../services/db';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const apiKey = authHeader.split(' ')[1];

  try {
    const user = await prisma.user.findUnique({
      where: { apiKey },
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }

    // Attach user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
