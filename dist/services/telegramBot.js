"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _nodeTelegramBotApi = _interopRequireDefault(require("node-telegram-bot-api"));
var bot = new _nodeTelegramBotApi["default"](process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  console.log('Message from Telegram:', msg.text);
  bot.sendMessage(chatId, '🚀 LifePlane Support Bot here! We got your message.');
});
var _default = bot;
exports["default"] = _default;