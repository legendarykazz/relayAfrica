"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const dns_1 = require("../services/dns");
const router = (0, express_1.Router)();
router.post('/verify', auth_1.authMiddleware, async (req, res) => {
    const { domain } = req.body;
    if (!domain) {
        return res.status(400).json({ error: 'Domain is required' });
    }
    try {
        const results = await (0, dns_1.checkDnsRecords)(domain);
        res.json(results);
    }
    catch (error) {
        console.error('DNS Verification Error:', error);
        res.status(500).json({ error: 'Failed to verify domain' });
    }
});
exports.default = router;
