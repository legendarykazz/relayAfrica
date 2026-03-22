# 🛰️ Relay Africa Setup Guide

Follow these steps to make your Relay Africa instance fully functional.

## 1. Prerequisites
- **Node.js 18+**
- **Docker Desktop** (for Database & Redis)
- **Amazon SES Account** (for real email sending)

## 2. Infrastructure Setup
### Option A: With Docker (Recommended)
Run the following in the root directory to start PostgreSQL and Redis:
```bash
docker-compose up -d
```
*Note: Ensure Docker Desktop is running.*

### Option B: No-Docker (Quick Start)
If you don't have Docker, you can use SQLite for the database:
1. In `apps/api/prisma/schema.prisma`, change the provider to `sqlite`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```
2. Update `apps/api/.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
3. Run `npx prisma migrate dev` as usual.
4. *Note: Redis is still required for BullMQ queues. You can install it locally or use a mock for testing.*
4. Start the API: `npm run dev`

## 4. Frontend Configuration (apps/web)
1. Navigate to the Web folder: `cd apps/web`
2. Install dependencies: `npm install`
3. Start the Dashboard: `npm run dev`

## 5. Testing the API
Send a test email using curl:
```bash
curl -X POST http://localhost:3001/api/send \\
  -H "Authorization: Bearer test_api_key_123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "your-email@example.com",
    "subject": "Relay Africa Test",
    "html": "<h1>It works!</h1>"
  }'
```

---
Made for **Relay Africa**.
