console.log('--- API_STARTING_UP ---');
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import emailRoutes from './routes/email';
import statsRoutes from './routes/stats';
import userRoutes from './routes/user';
import domainRoutes from './routes/domain';
import logsRoutes from './routes/logs';
import contactsRoutes from './routes/contacts';
import campaignsRoutes from './routes/campaigns';
import { sendSms, sendWhatsApp } from './services/messaging';
import { createAndSendOtp, verifyOtp } from './services/otp';
import prisma from './services/db';
import { authMiddleware } from './middleware/auth';
import './services/queue';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.all('*', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] REQUEST_DETECTED: ${req.method} ${req.url}`);
  next();
});

app.use('/api/logs', logsRoutes);

app.use('/api/stats', statsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/domain', domainRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/campaigns', campaignsRoutes);

// Flat Messaging Routes
app.post('/api/sms', authMiddleware, async (req: any, res: any) => {
  const { to, message } = req.body;
  const user = req.user;
  try {
    const log = await prisma.smsLog.create({ data: { userId: user.id, to, message, status: 'PENDING' } });
    try {
      await sendSms(to, message);
      await prisma.smsLog.update({ where: { id: log.id }, data: { status: 'SENT' } });
      res.json({ success: true, logId: log.id });
    } catch (e: any) {
      await prisma.smsLog.update({ where: { id: log.id }, data: { status: 'FAILED', error: e.message } });
      res.status(500).json({ error: e.message });
    }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post('/api/whatsapp', authMiddleware, async (req: any, res: any) => {
  const { to, message } = req.body;
  const user = req.user;
  try {
    const log = await prisma.whatsAppLog.create({ data: { userId: user.id, to, message, status: 'PENDING' } });
    try {
      await sendWhatsApp(to, message);
      await prisma.whatsAppLog.update({ where: { id: log.id }, data: { status: 'SENT' } });
      res.json({ success: true, logId: log.id });
    } catch (e: any) {
      await prisma.whatsAppLog.update({ where: { id: log.id }, data: { status: 'FAILED', error: e.message } });
      res.status(500).json({ error: e.message });
    }
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post('/api/otp-request', authMiddleware, async (req: any, res: any) => {
  const { to, channel } = req.body;
  const user = req.user;
  try {
    await createAndSendOtp(to, channel, user.id);
    res.json({ success: true, message: `OTP sent via ${channel}` });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.post('/api/otp/verify', async (req: any, res: any) => {
  const { to, code } = req.body;
  try {
    const isValid = await verifyOtp(to, code);
    if (isValid) res.json({ success: true, message: 'OTP verified' });
    else res.status(400).json({ success: false, error: 'Invalid OTP' });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.use('/api', emailRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
  process.stdout.write('--- SERVER_IS_DEFINITIVELY_UP ---\n');
});
