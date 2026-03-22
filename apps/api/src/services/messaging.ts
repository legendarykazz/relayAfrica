import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const sendSms = async (to: string, message: string) => {
  if (!client) {
    console.log(`[MOCK SMS] To: ${to}, Message: ${message}`);
    return { sid: 'mock_sid_' + Math.random().toString(36).substr(2, 9) };
  }
  
  return client.messages.create({
    body: message,
    from: fromNumber,
    to
  });
};

export const sendWhatsApp = async (to: string, message: string) => {
  if (!client) {
    console.log(`[MOCK WHATSAPP] To: ${to}, Message: ${message}`);
    return { sid: 'mock_wa_sid_' + Math.random().toString(36).substr(2, 9) };
  }

  return client.messages.create({
    body: message,
    from: `whatsapp:${fromNumber}`,
    to: `whatsapp:${to}`
  });
};
