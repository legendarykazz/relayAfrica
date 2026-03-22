import { Router, Request, Response } from 'express';
import prisma from '../services/db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET all Audience Lists safely created by this user
router.get('/lists', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const lists = await prisma.audienceList.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { contacts: true, campaigns: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(lists);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE an Audience List
router.post('/lists', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'List name required' });

  try {
    const list = await prisma.audienceList.create({
      data: { userId: user.id, name }
    });
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET Contacts in a specific Audience List
router.get('/lists/:id/contacts', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const listId = req.params.id as string;

  try {
    // Verify list belongs to user
    const list = await prisma.audienceList.findUnique({ where: { id: listId } });
    if (!list || list.userId !== user.id) return res.status(404).json({ error: 'List not found' });

    const contacts = await prisma.contact.findMany({
      where: { audienceListId: listId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ADD Contact to an Audience List
router.post('/lists/:id/contacts', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const listId = req.params.id as string;
  const { email, firstName, lastName, phone } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const list = await prisma.audienceList.findUnique({ where: { id: listId } });
    if (!list || list.userId !== user.id) return res.status(404).json({ error: 'List not found' });

    const contact = await prisma.contact.upsert({
      where: { audienceListId_email: { audienceListId: listId, email } },
      update: { firstName, lastName, phone },
      create: { audienceListId: listId, email, firstName, lastName, phone }
    });
    
    res.json(contact);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
