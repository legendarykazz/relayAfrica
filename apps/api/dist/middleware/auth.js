"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const db_1 = __importDefault(require("../services/db"));
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    const apiKey = authHeader.split(' ')[1];
    try {
        const user = await db_1.default.user.findUnique({
            where: { apiKey },
        });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.authMiddleware = authMiddleware;
