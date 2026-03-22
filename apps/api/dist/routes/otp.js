"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otp_1 = require("../services/otp");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Request OTP
router.post('/request', auth_1.authMiddleware, async (req, res) => {
    const { to, channel } = req.body; // channel: 'email' | 'sms' | 'whatsapp'
    const user = req.user;
    if (!to || !channel) {
        return res.status(400).json({ error: 'Missing recipient or channel' });
    }
    try {
        await (0, otp_1.createAndSendOtp)(to, channel, user.id);
        res.json({ success: true, message: `OTP sent via ${channel}` });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Verify OTP
router.post('/verify', async (req, res) => {
    const { to, code } = req.body;
    if (!to || !code) {
        return res.status(400).json({ error: 'Missing recipient or code' });
    }
    try {
        const isValid = await (0, otp_1.verifyOtp)(to, code);
        if (isValid) {
            res.json({ success: true, message: 'OTP verified successfully' });
        }
        else {
            res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
