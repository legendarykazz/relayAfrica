import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { checkDnsRecords } from '../services/dns';
import prisma from '../services/db';

const router = Router();

// 1. List all domains
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const domains = await prisma.domain.findMany({
      where: { userId: user.id }
    });
    res.json(domains);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

// 2. Add a new domain
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = (req as any).user;

  if (!name) return res.status(400).json({ error: 'Domain name is required' });

  try {
    // Check if domain name is valid format
    if (!name.includes('.')) {
      return res.status(400).json({ error: 'Invalid domain format. Use e.g. domain.com' });
    }

    const domain = await prisma.domain.create({
      data: {
        name,
        userId: user.id,
      }
    });
    res.status(201).json(domain);
  } catch (error: any) {
    console.error('Domain Creation Error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'This domain is already registered.' });
    }
    res.status(500).json({ error: 'Internal database error. Please try again.' });
  }
});

// 3. Verify a domain by ID
router.post('/:id/verify', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const domain = await prisma.domain.findUnique({
      where: { id, userId: user.id }
    });

    if (!domain) return res.status(404).json({ error: 'Domain not found' });

    const results = await checkDnsRecords(domain.name);
    
    const updated = await prisma.domain.update({
      where: { id },
      data: {
        spfStatus: results.spf,
        dkimStatus: results.dkim,
        dmarcStatus: results.dmarc,
        verifiedAt: (results.spf === 'VERIFIED' && results.dkim === 'VERIFIED') ? new Date() : null
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// 4. Delete a domain
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    await prisma.domain.delete({
      where: { id, userId: user.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete domain' });
  }
});

export default router;
