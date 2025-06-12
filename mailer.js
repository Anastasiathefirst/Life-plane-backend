require('dotenv').config();

console.log('🔑 API KEY:', process.env.MAILGUN_API_KEY); // Проверка, подгружается ли ключ

const mailgun = require('mailgun-js');

const DOMAIN = 'mg.lifeplane.pro';
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: DOMAIN,
  host: process.env.MAILGUN_HOST || 'api.eu.mailgun.net'
});

function sendTestEmail() {
  const data = {
    from: 'LifePlane <noreply@mg.lifeplane.pro>',
    to: 'aes.ivanova@gmail.com',
    subject: 'Test email from LifePlane backend',
    text: 'Привет! Это тестовое письмо из твоего бэкенда. 📬 Если ты читаешь это — значит, оно дошло.',
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error('❌ Ошибка при отправке письма:', error);
    } else {
      console.log('✅ Письмо отправлено успешно:', body);
    }
  });
}

sendTestEmail();
