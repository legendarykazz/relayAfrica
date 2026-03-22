"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../services/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
console.log('--- LOGS_ROUTER_LOADED ---');
// Get paginated Email Logs
router.get('/email', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const [logs, total] = await Promise.all([
            db_1.default.emailLog.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            db_1.default.emailLog.count({
                where: { userId: user.id },
            }),
        ]);
        res.json({
            logs: logs.map((log) => ({
                id: log.id,
                to: log.to,
                subject: log.subject,
                html: log.html,
                status: log.status,
                createdAt: log.createdAt,
            })),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch email logs' });
    }
});
// Get paginated SMS Logs
router.get('/sms', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const [logs, total] = await Promise.all([
            db_1.default.smsLog.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            db_1.default.smsLog.count({
                where: { userId: user.id },
            }),
        ]);
        res.json({
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch SMS logs' });
    }
});
// Get paginated WhatsApp Logs
router.get('/whatsapp', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const [logs, total] = await Promise.all([
            db_1.default.whatsAppLog.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            db_1.default.whatsAppLog.count({
                where: { userId: user.id },
            }),
        ]);
        res.json({
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch WhatsApp logs' });
    }
});
exports.default = router;
