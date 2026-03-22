"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../services/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    console.log('Stats request for user:', user?.id);
    try {
        // 1. Get total emails sent
        const totalSent = await db_1.default.emailLog.count({
            where: { userId: user.id },
        });
        // 2. Get success rate
        const successful = await db_1.default.emailLog.count({
            where: {
                userId: user.id,
                status: 'SENT'
            },
        });
        const successRate = totalSent === 0 ? 100 : Math.round((successful / totalSent) * 100);
        // 3. Get pending/failed
        const pending = await db_1.default.emailLog.count({
            where: {
                userId: user.id,
                status: 'PENDING'
            },
        });
        const failed = await db_1.default.emailLog.count({
            where: {
                userId: user.id,
                status: 'FAILED'
            },
        });
        // 4. Get recent logs
        const recentLogs = await db_1.default.emailLog.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        // 5. Get domains count
        const domainsCount = await db_1.default.domain.count({
            where: { userId: user.id },
        });
        // 6. Get SMS and WhatsApp counts
        const smsCount = await db_1.default.smsLog.count({
            where: { userId: user.id, status: 'SENT' },
        });
        const waCount = await db_1.default.whatsAppLog.count({
            where: { userId: user.id, status: 'SENT' },
        });
        res.json({
            totalSent,
            successRate,
            pending,
            failed,
            domainsCount,
            smsCount,
            waCount,
            recentLogs: recentLogs.map((log) => ({
                id: log.id,
                to: log.to,
                subject: log.subject,
                html: log.html,
                status: log.status,
                createdAt: log.createdAt,
            })),
        });
    }
    catch (error) {
        console.error('Stats API Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            stack: error.stack
        });
    }
});
exports.default = router;
