"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const queue_1 = require("../services/queue");
const auth_1 = require("../middleware/auth");
const db_1 = __importDefault(require("../services/db"));
const router = (0, express_1.Router)();
router.post('/send', auth_1.authMiddleware, async (req, res) => {
    const { to, subject, html, from } = req.body;
    const user = req.user;
    if (!to || !subject || !html) {
        return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }
    try {
        // 1. If 'from' is provided, verify domain ownership
        let senderEmail = 'noreply@relay.africa';
        if (from) {
            const fromDomain = from.split('@')[1];
            if (!fromDomain)
                return res.status(400).json({ error: 'Invalid from address format' });
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
            senderEmail = from;
        }
        // 2. Create a log entry for the email
        const log = await db_1.default.emailLog.create({
            data: {
                userId: user.id,
                to,
                subject,
                html,
                status: 'PENDING',
            },
        });
        // 3. Add email to the queue with the optional sender
        await queue_1.emailQueue.add('send-email', {
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
    }
    catch (error) {
        console.error('Send Email API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
