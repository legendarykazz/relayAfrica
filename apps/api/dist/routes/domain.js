"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const dns_1 = require("../services/dns");
const db_1 = __importDefault(require("../services/db"));
const router = (0, express_1.Router)();
// 1. List all domains
router.get('/', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    try {
        const domains = await db_1.default.domain.findMany({
            where: { userId: user.id }
        });
        res.json(domains);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch domains' });
    }
});
// 2. Add a new domain
router.post('/', auth_1.authMiddleware, async (req, res) => {
    const { name } = req.body;
    const user = req.user;
    if (!name)
        return res.status(400).json({ error: 'Domain name is required' });
    try {
        // Check if domain name is valid format
        if (!name.includes('.')) {
            return res.status(400).json({ error: 'Invalid domain format. Use e.g. domain.com' });
        }
        const domain = await db_1.default.domain.create({
            data: {
                name,
                userId: user.id,
            }
        });
        res.status(201).json(domain);
    }
    catch (error) {
        console.error('Domain Creation Error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'This domain is already registered.' });
        }
        res.status(500).json({ error: 'Internal database error. Please try again.' });
    }
});
// 3. Verify a domain by ID
router.post('/:id/verify', auth_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const domain = await db_1.default.domain.findUnique({
            where: { id, userId: user.id }
        });
        if (!domain)
            return res.status(404).json({ error: 'Domain not found' });
        const results = await (0, dns_1.checkDnsRecords)(domain.name);
        const updated = await db_1.default.domain.update({
            where: { id },
            data: {
                spfStatus: results.spf,
                dkimStatus: results.dkim,
                dmarcStatus: results.dmarc,
                verifiedAt: (results.spf === 'VERIFIED' && results.dkim === 'VERIFIED') ? new Date() : null
            }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
});
// 4. Delete a domain
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        await db_1.default.domain.delete({
            where: { id, userId: user.id }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete domain' });
    }
});
exports.default = router;
