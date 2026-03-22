"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../services/db"));
const auth_1 = require("../middleware/auth");
const queue_1 = require("../services/queue");
const router = (0, express_1.Router)();
// GET all campaigns
router.get('/', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    try {
        const campaigns = await db_1.default.campaign.findMany({
            where: { userId: user.id },
            include: {
                audienceList: true,
                template: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(campaigns);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET all templates
router.get('/templates', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    try {
        const templates = await db_1.default.template.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(templates);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// CREATE a template
router.post('/templates', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    const { name, subject, html } = req.body;
    if (!name || !subject || !html)
        return res.status(400).json({ error: 'Missing required fields' });
    try {
        const template = await db_1.default.template.create({
            data: { userId: user.id, name, subject, html }
        });
        res.json(template);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// CREATE and LAUNCH a campaign
router.post('/launch', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
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
            const verifiedDomain = await db_1.default.domain.findFirst({
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
        const contacts = await db_1.default.contact.findMany({
            where: { audienceListId }
        });
        if (contacts.length === 0) {
            return res.status(400).json({ error: 'Selected Audience List is empty' });
        }
        const template = await db_1.default.template.findUnique({ where: { id: templateId } });
        if (!template)
            return res.status(404).json({ error: 'Template not found' });
        // 2. Create Campaign entry
        const campaign = await db_1.default.campaign.create({
            data: {
                userId: user.id,
                name,
                audienceListId,
                templateId,
                fromAddress: senderEmail,
                status: 'QUEUED',
                sentCount: 0
            }
        });
        // 3. Dispatch to BullMQ Queue
        for (const contact of contacts) {
            const log = await db_1.default.emailLog.create({
                data: {
                    userId: user.id,
                    to: contact.email,
                    subject: template.subject,
                    html: template.html,
                    status: 'PENDING'
                }
            });
            await queue_1.emailQueue.add('send-campaign-email', {
                logId: log.id,
                to: contact.email,
                subject: template.subject,
                html: template.html,
                from: senderEmail,
                campaignId: campaign.id
            });
        }
        // 4. Update status to SENDING
        await db_1.default.campaign.update({
            where: { id: campaign.id },
            data: { status: 'SENDING' }
        });
        res.json({ success: true, campaignId: campaign.id, contactsQueued: contacts.length });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
