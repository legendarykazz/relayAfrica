"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('--- API_STARTING_UP ---');
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const email_1 = __importDefault(require("./routes/email"));
const stats_1 = __importDefault(require("./routes/stats"));
const user_1 = __importDefault(require("./routes/user"));
const domain_1 = __importDefault(require("./routes/domain"));
const logs_1 = __importDefault(require("./routes/logs"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const campaigns_1 = __importDefault(require("./routes/campaigns"));
const messaging_1 = require("./services/messaging");
const otp_1 = require("./services/otp");
const db_1 = __importDefault(require("./services/db"));
const auth_1 = require("./middleware/auth");
require("./services/queue");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.all('*', (req, res, next) => {
    console.log(`[${new Date().toISOString()}] REQUEST_DETECTED: ${req.method} ${req.url}`);
    next();
});
app.use('/api/logs', logs_1.default);
app.use('/api/stats', stats_1.default);
app.use('/api/user', user_1.default);
app.use('/api/domain', domain_1.default);
app.use('/api/contacts', contacts_1.default);
app.use('/api/campaigns', campaigns_1.default);
// Flat Messaging Routes
app.post('/api/sms', auth_1.authMiddleware, async (req, res) => {
    const { to, message } = req.body;
    const user = req.user;
    try {
        const log = await db_1.default.smsLog.create({ data: { userId: user.id, to, message, status: 'PENDING' } });
        try {
            await (0, messaging_1.sendSms)(to, message);
            await db_1.default.smsLog.update({ where: { id: log.id }, data: { status: 'SENT' } });
            res.json({ success: true, logId: log.id });
        }
        catch (e) {
            await db_1.default.smsLog.update({ where: { id: log.id }, data: { status: 'FAILED', error: e.message } });
            res.status(500).json({ error: e.message });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/whatsapp', auth_1.authMiddleware, async (req, res) => {
    const { to, message } = req.body;
    const user = req.user;
    try {
        const log = await db_1.default.whatsAppLog.create({ data: { userId: user.id, to, message, status: 'PENDING' } });
        try {
            await (0, messaging_1.sendWhatsApp)(to, message);
            await db_1.default.whatsAppLog.update({ where: { id: log.id }, data: { status: 'SENT' } });
            res.json({ success: true, logId: log.id });
        }
        catch (e) {
            await db_1.default.whatsAppLog.update({ where: { id: log.id }, data: { status: 'FAILED', error: e.message } });
            res.status(500).json({ error: e.message });
        }
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/otp-request', auth_1.authMiddleware, async (req, res) => {
    const { to, channel } = req.body;
    const user = req.user;
    try {
        await (0, otp_1.createAndSendOtp)(to, channel, user.id);
        res.json({ success: true, message: `OTP sent via ${channel}` });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.post('/api/otp/verify', async (req, res) => {
    const { to, code } = req.body;
    try {
        const isValid = await (0, otp_1.verifyOtp)(to, code);
        if (isValid)
            res.json({ success: true, message: 'OTP verified' });
        else
            res.status(400).json({ success: false, error: 'Invalid OTP' });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.use('/api', email_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
    process.stdout.write('--- SERVER_IS_DEFINITIVELY_UP ---\n');
});
