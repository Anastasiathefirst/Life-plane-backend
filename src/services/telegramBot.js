import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log('Message from Telegram:', msg.text);

  bot.sendMessage(chatId, '🚀 LifePlane Support Bot here! We got your message.');
});

export default bot;
