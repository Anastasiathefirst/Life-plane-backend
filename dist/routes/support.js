"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = _interopRequireDefault(require("express"));
var _mailgunJs = _interopRequireDefault(require("mailgun-js"));
var _SupportMessage = _interopRequireDefault(require("../models/SupportMessage.js"));
var router = _express["default"].Router();

// Проверим, есть ли вообще нужные переменные
if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
  console.warn('⚠️  MAILGUN_API_KEY или MAILGUN_DOMAIN не определены. Письма отправляться не будут.');
}
var mg = (0, _mailgunJs["default"])({
  apiKey: process.env.MAILGUN_API_KEY || 'no-key',
  domain: process.env.MAILGUN_DOMAIN || 'no-domain'
});
router.post('/message', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, userEmail, message, saved, data, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, userEmail = _req$body.userEmail, message = _req$body.message;
          if (!(!userEmail || !message)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            error: 'Missing email or message'
          }));
        case 3:
          _context.prev = 3;
          _context.next = 6;
          return _SupportMessage["default"].create({
            userEmail: userEmail,
            message: message
          });
        case 6:
          saved = _context.sent;
          console.log('💾 Support message saved:', saved);

          // Пытаемся отправить письмо
          data = {
            from: 'Life Plane Support <support@lifeplane.app>',
            to: 'studio@listento.pro',
            subject: 'Новый запрос в поддержку',
            text: "Email \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F: ".concat(userEmail, "\n\n\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435:\n").concat(message)
          };
          _context.prev = 9;
          _context.next = 12;
          return mg.messages().send(data);
        case 12:
          result = _context.sent;
          console.log('📧 Mailgun response:', result);
          _context.next = 19;
          break;
        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](9);
          console.error('❌ Mailgun error:', _context.t0.message || _context.t0);
        case 19:
          res.status(200).json({
            success: true,
            message: 'Support request processed'
          });
          _context.next = 26;
          break;
        case 22:
          _context.prev = 22;
          _context.t1 = _context["catch"](3);
          console.error('🔥 Server crash in /support/message:', _context.t1.message || _context.t1);
          res.status(500).json({
            error: 'Server error'
          });
        case 26:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 22], [9, 16]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var _default = router;
exports["default"] = _default;