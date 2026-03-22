# 🛰️ Relay Africa: Multi-Channel Messaging & CRM Platform

Relay Africa is a powerful, self-hosted messaging infrastructure designed to handle **Email (Amazon SES)**, **SMS**, and **WhatsApp (Twilio)** with ease. It features a built-in CRM for managing audience lists and a visual Campaign Builder for dispatching bulk HTML emails.

## 🚀 Key Features
- **Multi-Channel API**: A unified interface to send Email, SMS, and WhatsApp messages.
- **WhatsApp OTP / 2FA**: Secure your users with automated WhatsApp and Email verification codes.
- **Audience Management (CRM)**: Create and manage custom contact lists (Subscribers, Internal Teams, etc.).
- **Email Campaign Builder**: Design rich HTML emails and dispatch them to thousands of recipients in real-time.
- **Delivery Monitoring**: Live logs of every message sent, including status tracking and content previews.
- **Infrastructure**: Powered by Amazon SES, Twilio, Redis, and PostgreSQL.

## 🛠️ Setup Guide

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

## 🌍 Cloud Deployment

Relay Africa is structured as a monorepo. To deploy to the cloud, use the following recommended settings:

### 1. Frontend (Next.js) - [Vercel](https://vercel.com)
- **Root Directory**: `apps/web`
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Environment Variables**: Add your API URL as `NEXT_PUBLIC_API_URL` if you aren't using the built-in proxy.

### 2. Backend (Express) - [Render](https://render.com) or [Railway](https://railway.app)
- **Root Directory**: `apps/api`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: `DATABASE_URL`, `REDIS_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`.

---
Made for **Relay Africa**.
