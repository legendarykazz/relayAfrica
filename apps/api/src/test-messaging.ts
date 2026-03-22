import axios from 'axios';

const API_KEY = 'test_api_key_123';
const BASE_URL = 'http://127.0.0.1:3001/api';

async function testMessaging() {
  console.log('--- TESTING MULTI-CHANNEL MESSAGING ---');

  try {
    // 1. Test SMS
    console.log('Sending Test SMS...');
    const smsRes = await axios.post(`${BASE_URL}/sms`, {
      to: '+1234567890',
      message: 'Hello from Relay Africa SMS!'
    }, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    console.log('SMS Result:', smsRes.data);

    // 2. Test WhatsApp
    console.log('Sending Test WhatsApp...');
    const waRes = await axios.post(`${BASE_URL}/whatsapp`, {
      to: '+1234567890',
      message: 'Hello from Relay Africa WhatsApp!'
    }, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    console.log('WhatsApp Result:', waRes.data);

    // 3. Test OTP Request
    console.log('Requesting OTP via Email...');
    const otpRes = await axios.post(`${BASE_URL}/otp-request`, {
      to: 'onboarding@resend.dev',
      channel: 'email'
    }, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    console.log('OTP Result:', otpRes.data);

    // 4. Test OTP Request via WhatsApp
    console.log('Requesting OTP via WhatsApp...');
    const otpWaRes = await axios.post(`${BASE_URL}/otp-request`, {
      to: '+1234567890',
      channel: 'whatsapp'
    }, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    console.log('WhatsApp OTP Result:', otpWaRes.data);

  } catch (error: any) {
    console.error('Test Failed:', error.response?.data || error.message);
  }
}

testMessaging();
