"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsApp = exports.sendSms = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const client = accountSid && authToken ? (0, twilio_1.default)(accountSid, authToken) : null;
const sendSms = async (to, message) => {
    if (!client) {
        console.log(`[MOCK SMS] To: ${to}, Message: ${message}`);
        return { sid: 'mock_sid_' + Math.random().toString(36).substr(2, 9) };
    }
    return client.messages.create({
        body: message,
        from: fromNumber,
        to
    });
};
exports.sendSms = sendSms;
const sendWhatsApp = async (to, message) => {
    if (!client) {
        console.log(`[MOCK WHATSAPP] To: ${to}, Message: ${message}`);
        return { sid: 'mock_wa_sid_' + Math.random().toString(36).substr(2, 9) };
    }
    return client.messages.create({
        body: message,
        from: `whatsapp:${fromNumber}`,
        to: `whatsapp:${to}`
    });
};
exports.sendWhatsApp = sendWhatsApp;
