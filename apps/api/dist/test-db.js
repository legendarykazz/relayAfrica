"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Testing DB connection...');
    try {
        const logs = await prisma.emailLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        console.log('Final Email Logs:');
        logs.forEach(l => console.log(`- To: ${l.to}, Status: ${l.status}, Error: ${l.error ?? 'None'}`));
    }
    catch (e) {
        console.error('DB Check Failed:', e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
