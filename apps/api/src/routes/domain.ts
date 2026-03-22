import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { checkDnsRecords } from '../services/dns';

const router = Router();

router.post('/verify', authMiddleware, async (req: Request, res: Response) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const results = await checkDnsRecords(domain);
    res.json(results);
  } catch (error) {
    console.error('DNS Verification Error:', error);
    res.status(500).json({ error: 'Failed to verify domain' });
  }
});

export default router;
