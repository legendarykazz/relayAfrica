"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messaging_1 = require("../services/messaging");
const db_1 = __importDefault(require("../services/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// SMS Route
router.post('/sms', auth_1.authMiddleware, async (req, res) => {
    const { to, message } = req.body;
    const user = req.user;
    if (!to || !message) {
        return res.status(400).json({ error: 'Missing recipient or message' });
    }
    try {
        const log = await db_1.default.smsLog.create({
            data: {
                userId: user.id,
                to,
                message,
                status: 'PENDING'
            }
        });
        try {
            await (0, messaging_1.sendSms)(to, message);
            await db_1.default.smsLog.update({
                where: { id: log.id },
                data: { status: 'SENT' }
            });
            res.json({ success: true, logId: log.id });
        }
        catch (error) {
            await db_1.default.smsLog.update({
                where: { id: log.id },
                data: { status: 'FAILED', error: error.message }
            });
            res.status(500).json({ error: error.message });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// WhatsApp Route
router.post('/whatsapp', auth_1.authMiddleware, async (req, res) => {
    const { to, message } = req.body;
    const user = req.user;
    if (!to || !message) {
        return res.status(400).json({ error: 'Missing recipient or message' });
    }
    try {
        const log = await db_1.default.whatsAppLog.create({
            data: {
                userId: user.id,
                to,
                message,
                status: 'PENDING'
            }
        });
        try {
            await (0, messaging_1.sendWhatsApp)(to, message);
            await db_1.default.whatsAppLog.update({
                where: { id: log.id },
                data: { status: 'SENT' }
            });
            res.json({ success: true, logId: log.id });
        }
        catch (error) {
            await db_1.default.whatsAppLog.update({
                where: { id: log.id },
                data: { status: 'FAILED', error: error.message }
            });
            res.status(500).json({ error: error.message });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
