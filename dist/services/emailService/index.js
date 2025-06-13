"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transport = exports.sendVerificationEmail = exports.sendResetPasswordEmail = exports.sendEmail = exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _logger = _interopRequireDefault(require("../../config/logger"));
var _template = _interopRequireDefault(require("./template"));
var _config = _interopRequireDefault(require("../../config/config"));
var transport = _nodemailer["default"].createTransport({
  host: _config["default"].SMTP_HOST,
  port: Number(_config["default"].SMTP_PORT),
  secure: _config["default"].SMTP_SECURE === 'true',
  auth: {
    user: _config["default"].SMTP_USERNAME,
    pass: _config["default"].SMTP_PASSWORD
  }
});
exports.transport = transport;
if (_config["default"].NODE_ENV !== 'test') {
  transport.verify().then(function () {
    return _logger["default"].info('📬 Connected to email server');
  })["catch"](function (err) {
    return _logger["default"].warn('❌ Unable to connect to email server:', err);
  });
}
var sendEmail = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(to, subject, html) {
    var msg, info;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          msg = {
            from: "".concat(_config["default"].APP_NAME, " <").concat(_config["default"].EMAIL_FROM, ">"),
            to: to,
            subject: subject,
            html: html
          };
          console.log('➡️ Sending email:', {
            to: to,
            subject: subject
          });
          _context.prev = 2;
          _context.next = 5;
          return transport.sendMail(msg);
        case 5:
          info = _context.sent;
          console.log('✅ Email sent:', info.messageId);
          return _context.abrupt("return", info);
        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](2);
          _logger["default"].error('❌ Failed to send email:', _context.t0);
          throw _context.t0;
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[2, 10]]);
  }));
  return function sendEmail(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
exports.sendEmail = sendEmail;
var sendVerificationEmail = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(to, token) {
    var subject, html;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log('➡️ sendVerificationEmail token:', token);
          subject = 'Код подтверждения email';
          html = _template["default"].verifyEmail(token, _config["default"].APP_NAME);
          return _context2.abrupt("return", sendEmail(to, subject, html));
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function sendVerificationEmail(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
exports.sendVerificationEmail = sendVerificationEmail;
var sendResetPasswordEmail = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(to, token) {
    var subject, resetPasswordUrl, html;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          console.log('➡️ sendResetPasswordEmail token:', token);
          subject = 'Reset password';
          resetPasswordUrl = "".concat(_config["default"].FRONTEND_URL, "/reset-password?token=").concat(token);
          html = _template["default"].resetPassword(resetPasswordUrl, _config["default"].APP_NAME);
          return _context3.abrupt("return", sendEmail(to, subject, html));
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function sendResetPasswordEmail(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
exports.sendResetPasswordEmail = sendResetPasswordEmail;
var _default = {
  sendEmail: sendEmail,
  sendVerificationEmail: sendVerificationEmail,
  sendResetPasswordEmail: sendResetPasswordEmail
};
exports["default"] = _default;