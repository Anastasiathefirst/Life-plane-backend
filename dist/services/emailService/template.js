"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyEmail = exports.resetPassword = exports["default"] = void 0;
var verifyEmail = function verifyEmail(code, appName) {
  return "\n    <html>\n      <body style=\"font-family: Arial, sans-serif; text-align: center; padding: 30px;\">\n        <h2 style=\"color: #333;\">\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C \u0432 ".concat(appName, "!</h2>\n        <p>\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u043D\u0438\u0436\u0435 \u0432 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0438:</p>\n        <h1 style=\"letter-spacing: 4px; font-size: 36px; color: #414EF9;\">").concat(code, "</h1>\n        <p style=\"margin-top: 30px; font-size: 14px; color: #777;\">\n          \u0415\u0441\u043B\u0438 \u0432\u044B \u043D\u0435 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043B\u0438\u0441\u044C \u2014 \u043F\u0440\u043E\u0441\u0442\u043E \u043F\u0440\u043E\u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u044D\u0442\u043E \u043F\u0438\u0441\u044C\u043C\u043E.\n        </p>\n      </body>\n    </html>\n  ");
};
exports.verifyEmail = verifyEmail;
var resetPassword = function resetPassword(url, appName) {
  return "\n    <html>\n      <body style=\"font-family: Arial, sans-serif; text-align: center; padding: 30px;\">\n        <h2 style=\"color: #333;\">\u0421\u0431\u0440\u043E\u0441 \u043F\u0430\u0440\u043E\u043B\u044F \u0434\u043B\u044F ".concat(appName, "</h2>\n        <p>\u041A\u0442\u043E-\u0442\u043E (\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0432\u044B) \u0437\u0430\u043F\u0440\u043E\u0441\u0438\u043B \u0441\u0431\u0440\u043E\u0441 \u043F\u0430\u0440\u043E\u043B\u044F. \u0412\u043E\u0442 \u0441\u0441\u044B\u043B\u043A\u0430:</p>\n        <a href=\"").concat(url, "\" style=\"display: inline-block; padding: 12px 24px; background-color: #414EF9; color: white; text-decoration: none; border-radius: 5px;\">\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C</a>\n        <p style=\"margin-top: 30px; font-size: 14px; color: #777;\">\n          \u0415\u0441\u043B\u0438 \u0432\u044B \u043D\u0435 \u0437\u0430\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u043B\u0438 \u0441\u0431\u0440\u043E\u0441 \u043F\u0430\u0440\u043E\u043B\u044F, \u043F\u0440\u043E\u0441\u0442\u043E \u043F\u0440\u043E\u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u044D\u0442\u043E \u043F\u0438\u0441\u044C\u043C\u043E.\n        </p>\n      </body>\n    </html>\n  ");
};
exports.resetPassword = resetPassword;
var _default = {
  verifyEmail: verifyEmail,
  resetPassword: resetPassword
};
exports["default"] = _default;