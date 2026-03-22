import { Router, Request, Response } from 'express';
import { createAndSendOtp, verifyOtp } from '../services/otp';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Request OTP
router.post('/request', authMiddleware, async (req: Request, res: Response) => {
  const { to, channel } = req.body; // channel: 'email' | 'sms' | 'whatsapp'
  const user = (req as any).user;

  if (!to || !channel) {
    return res.status(400).json({ error: 'Missing recipient or channel' });
  }

  try {
    await createAndSendOtp(to, channel, user.id);
    res.json({ success: true, message: `OTP sent via ${channel}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP
router.post('/verify', async (req: Request, res: Response) => {
  const { to, code } = req.body;

  if (!to || !code) {
    return res.status(400).json({ error: 'Missing recipient or code' });
  }

  try {
    const isValid = await verifyOtp(to, code);
    if (isValid) {
      res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
