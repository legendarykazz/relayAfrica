"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../services/db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET all Audience Lists safely created by this user
router.get('/lists', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    try {
        const lists = await db_1.default.audienceList.findMany({
            where: { userId: user.id },
            include: {
                _count: {
                    select: { contacts: true, campaigns: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(lists);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// CREATE an Audience List
router.post('/lists', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    const { name } = req.body;
    if (!name)
        return res.status(400).json({ error: 'List name required' });
    try {
        const list = await db_1.default.audienceList.create({
            data: { userId: user.id, name }
        });
        res.json(list);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET Contacts in a specific Audience List
router.get('/lists/:id/contacts', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    const listId = req.params.id;
    try {
        // Verify list belongs to user
        const list = await db_1.default.audienceList.findUnique({ where: { id: listId } });
        if (!list || list.userId !== user.id)
            return res.status(404).json({ error: 'List not found' });
        const contacts = await db_1.default.contact.findMany({
            where: { audienceListId: listId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(contacts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ADD Contact to an Audience List
router.post('/lists/:id/contacts', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    const listId = req.params.id;
    const { email, firstName, lastName, phone } = req.body;
    if (!email)
        return res.status(400).json({ error: 'Email is required' });
    try {
        const list = await db_1.default.audienceList.findUnique({ where: { id: listId } });
        if (!list || list.userId !== user.id)
            return res.status(404).json({ error: 'List not found' });
        const contact = await db_1.default.contact.upsert({
            where: { audienceListId_email: { audienceListId: listId, email } },
            update: { firstName, lastName, phone },
            create: { audienceListId: listId, email, firstName, lastName, phone }
        });
        res.json(contact);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
