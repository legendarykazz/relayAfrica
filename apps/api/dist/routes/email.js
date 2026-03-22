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
    const { to, subject, html } = req.body;
    const user = req.user;
    if (!to || !subject || !html) {
        return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
    }
    try {
        // 1. Create a log entry for the email
        const log = await db_1.default.emailLog.create({
            data: {
                userId: user.id,
                to,
                subject,
                html,
                status: 'PENDING',
            },
        });
        // 2. Add email to the queue
        await queue_1.emailQueue.add('send-email', {
            logId: log.id,
            to,
            subject,
            html,
        });
        res.status(202).json({
            message: 'Email queued successfully',
            logId: log.id,
        });
    }
    catch (error) {
        console.error('Send Email API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
