import express from 'express';
import mailgun from 'mailgun-js';
import SupportMessage from '../models/SupportMessage.js';

const router = express.Router();

// Проверим, есть ли вообще нужные переменные
if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
  console.warn('⚠️  MAILGUN_API_KEY или MAILGUN_DOMAIN не определены. Письма отправляться не будут.');
}

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY || 'no-key',
  domain: process.env.MAILGUN_DOMAIN || 'no-domain',
});

router.post('/message', async (req, res) => {
  const { userEmail, message } = req.body;

  if (!userEmail || !message) {
    return res.status(400).json({ error: 'Missing email or message' });
  }

  try {
    // Сохраняем сообщение в Mongo
    const saved = await SupportMessage.create({ userEmail, message });
    console.log('💾 Support message saved:', saved);

    // Пытаемся отправить письмо
    const data = {
      from: 'Life Plane Support <support@lifeplane.app>',
      to: 'studio@listento.pro',
      subject: 'Новый запрос в поддержку',
      text: `Email пользователя: ${userEmail}\n\nСообщение:\n${message}`,
    };

    try {
      const result = await mg.messages().send(data);
      console.log('📧 Mailgun response:', result);
    } catch (mailErr) {
      console.error('❌ Mailgun error:', mailErr.message || mailErr);
    }

    res.status(200).json({ success: true, message: 'Support request processed' });
  } catch (err) {
    console.error('🔥 Server crash in /support/message:', err.message || err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
