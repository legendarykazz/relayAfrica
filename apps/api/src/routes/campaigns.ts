import { Router, Request, Response } from 'express';
import prisma from '../services/db';
import { authMiddleware } from '../middleware/auth';
import { emailQueue } from '../services/queue';

const router = Router();

// GET all campaigns
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { userId: user.id },
      include: {
        audienceList: true,
        template: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(campaigns);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET all templates
router.get('/templates', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const templates = await prisma.template.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a template
router.post('/templates', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, subject, html } = req.body;

  if (!name || !subject || !html) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const template = await prisma.template.create({
      data: { userId: user.id, name, subject, html }
    });
    res.json(template);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE and LAUNCH a campaign
router.post('/launch', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, audienceListId, templateId, fromAddress } = req.body;

  if (!name || !audienceListId || !templateId) {
    return res.status(400).json({ error: 'Missing required campaign parameters' });
  }

  try {
    // 0. Verify 'fromAddress' domain if provided
    let senderEmail = process.env.AWS_SES_FROM_ADDRESS || 'noreply@relay.africa';
    if (fromAddress) {
      const fromDomain = fromAddress.split('@')[1];
      if (!fromAddress.includes('@') || !fromDomain) {
        return res.status(400).json({ error: 'Invalid from address format' });
      }

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
      senderEmail = fromAddress;
    }
    // 1. Fetch contacts
    const contacts = await prisma.contact.findMany({
      where: { audienceListId }
    });

    if (contacts.length === 0) {
      return res.status(400).json({ error: 'Selected Audience List is empty' });
    }

    const template = await prisma.template.findUnique({ where: { id: templateId } });
    if (!template) return res.status(404).json({ error: 'Template not found' });

    // 2. Create Campaign entry
    const campaign = await prisma.campaign.create({
      data: {
        userId: user.id,
        name,
        audienceListId,
        templateId,
        fromAddress: senderEmail as any,
        status: 'QUEUED',
        sentCount: 0
      } as any
    });

    // 3. Dispatch to BullMQ Queue
    for (const contact of contacts) {
      const log = await prisma.emailLog.create({
        data: {
          userId: user.id,
          to: contact.email,
          subject: template.subject,
          html: template.html,
          status: 'PENDING'
        }
      });

      await (emailQueue as any).add('send-campaign-email', {
        logId: log.id,
        to: contact.email,
        subject: template.subject,
        html: template.html,
        from: senderEmail,
        campaignId: campaign.id
      });
    }

    // 4. Update status to SENDING
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: 'SENDING' }
    });

    res.json({ success: true, campaignId: campaign.id, contactsQueued: contacts.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
