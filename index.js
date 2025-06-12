const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const SupportMessage = require('./models/SupportMessage');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 📦 Подключение к Mongo
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// ✉️ Настройка SMTP Mailgun через Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// 🚨 Поддержка: POST /support/message
app.post('/support/message', async (req, res) => {
  const { userEmail, message } = req.body;

  if (!userEmail || !message) {
    return res.status(400).json({ error: 'Missing email or message' });
  }

  try {
    // 1. Сохраняем в Mongo
    await SupportMessage.create({ userEmail, message });

    // 2. Шлём письмо себе
    const mailOptions = {
      from: `"LifePlane Support" <${process.env.EMAIL_FROM}>`,
      to: 'studio@listento.pro',
      subject: 'Новый запрос в поддержку',
      text: `Пользователь: ${userEmail}\n\nСообщение:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Сообщение отправлено' });
  } catch (err) {
    console.error('Support error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// 🌍 Проверка сервера
app.get('/', (_, res) => res.send('🌱 LifePlane backend is running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
