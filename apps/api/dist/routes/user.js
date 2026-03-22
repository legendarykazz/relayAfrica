"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../services/db"));
const auth_1 = require("../middleware/auth");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
// Get current user profile (including API key)
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    res.json({
        id: user.id,
        email: user.email,
        apiKey: user.apiKey,
        createdAt: user.createdAt,
    });
});
// Rotate API Key
router.post('/rotate-key', auth_1.authMiddleware, async (req, res) => {
    const user = req.user;
    try {
        const updatedUser = await db_1.default.user.update({
            where: { id: user.id },
            data: { apiKey: crypto_1.default.randomUUID() },
        });
        res.json({
            message: 'API Key rotated successfully',
            apiKey: updatedUser.apiKey,
        });
    }
    catch (error) {
        console.error('User API Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        });
    }
});
exports.default = router;
