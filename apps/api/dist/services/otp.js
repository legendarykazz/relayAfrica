"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.createAndSendOtp = exports.generateOtp = void 0;
const db_1 = __importDefault(require("./db"));
const messaging_1 = require("./messaging");
const queue_1 = require("./queue");
const crypto_1 = __importDefault(require("crypto"));
const generateOtp = () => {
    return crypto_1.default.randomInt(100000, 999999).toString();
};
exports.generateOtp = generateOtp;
const createAndSendOtp = async (to, channel, userId) => {
    const code = (0, exports.generateOtp)();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    // 1. Store in DB
    await db_1.default.otp.create({
        data: {
            to,
            code,
            expiresAt
        }
    });
    const message = `Your Relay Africa verification code is: ${code}. Valid for 5 minutes.`;
    // 2. Send via channel
    if (channel === 'sms') {
        const log = await db_1.default.smsLog.create({
            data: { userId, to, message, status: 'PENDING' }
        });
        try {
            await (0, messaging_1.sendSms)(to, message);
            await db_1.default.smsLog.update({ where: { id: log.id }, data: { status: 'SENT' } });
            return { success: true };
        }
        catch (e) {
            await db_1.default.smsLog.update({ where: { id: log.id }, data: { status: 'FAILED', error: e.message } });
            throw e;
        }
    }
    else if (channel === 'whatsapp') {
        const log = await db_1.default.whatsAppLog.create({
            data: { userId, to, message, status: 'PENDING' }
        });
        try {
            await (0, messaging_1.sendWhatsApp)(to, message);
            await db_1.default.whatsAppLog.update({ where: { id: log.id }, data: { status: 'SENT' } });
            return { success: true };
        }
        catch (e) {
            await db_1.default.whatsAppLog.update({ where: { id: log.id }, data: { status: 'FAILED', error: e.message } });
            throw e;
        }
    }
    else {
        // For email, we need to create a log and queue it
        const log = await db_1.default.emailLog.create({
            data: {
                userId,
                to,
                subject: 'Verification Code',
                html: `<h1>${code}</h1><p>${message}</p>`,
                status: 'PENDING'
            }
        });
        return queue_1.emailQueue.add('send-email', {
            logId: log.id,
            to,
            subject: 'Verification Code',
            html: `<h1>${code}</h1><p>${message}</p>`
        });
    }
};
exports.createAndSendOtp = createAndSendOtp;
const verifyOtp = async (to, code) => {
    const otp = await db_1.default.otp.findFirst({
        where: {
            to,
            code,
            verified: false,
            expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: 'desc' }
    });
    if (!otp)
        return false;
    await db_1.default.otp.update({
        where: { id: otp.id },
        data: { verified: true }
    });
    return true;
};
exports.verifyOtp = verifyOtp;
