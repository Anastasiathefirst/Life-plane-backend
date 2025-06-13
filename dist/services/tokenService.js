"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateVerifyEmailToken = exports.generateRandomToken = exports.generateAuthTokens = exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _moment = _interopRequireDefault(require("moment"));
var _config = _interopRequireDefault(require("../config/config"));
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _jwtService = _interopRequireDefault(require("./jwtService"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var _crypto = _interopRequireDefault(require("crypto"));
var _userModel = _interopRequireDefault(require("../models/userModel"));
var _tokenModel = _interopRequireDefault(require("../models/tokenModel"));
var generateRandomToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var length,
      token,
      _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          length = _args.length > 0 && _args[0] !== undefined ? _args[0] : 32;
          token = _crypto["default"].randomBytes(length).toString('hex');
          console.log('➡️ generateRandomToken:', token);
          return _context.abrupt("return", token);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function generateRandomToken() {
    return _ref.apply(this, arguments);
  };
}();
exports.generateRandomToken = generateRandomToken;
var generateAuthTokens = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(user) {
    var accessTokenExpires, accessToken, refreshTokenExpires, refreshToken;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log('➡️ generateAuthTokens for user:', user.id);
          _context2.prev = 1;
          accessTokenExpires = (0, _moment["default"])().add(_config["default"].JWT_ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
          _context2.next = 5;
          return _jwtService["default"].sign(user.id, accessTokenExpires, _config["default"].JWT_ACCESS_TOKEN_SECRET_PRIVATE);
        case 5:
          accessToken = _context2.sent;
          console.log('➡️ Generated accessToken');
          refreshTokenExpires = (0, _moment["default"])().add(_config["default"].REFRESH_TOKEN_EXPIRATION_DAYS, 'days');
          _context2.next = 10;
          return generateRandomToken();
        case 10:
          refreshToken = _context2.sent;
          _context2.next = 13;
          return _tokenModel["default"].saveToken(refreshToken, user.id, refreshTokenExpires.toDate(), 'refresh');
        case 13:
          console.log('➡️ Saved refreshToken');
          return _context2.abrupt("return", {
            accessToken: {
              token: accessToken,
              expires: accessTokenExpires.toDate()
            },
            refreshToken: {
              token: refreshToken,
              expires: refreshTokenExpires.toDate()
            }
          });
        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](1);
          console.error('❌ Error in generateAuthTokens:', _context2.t0);
          throw _context2.t0;
        case 21:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 17]]);
  }));
  return function generateAuthTokens(_x) {
    return _ref2.apply(this, arguments);
  };
}();
exports.generateAuthTokens = generateAuthTokens;
var generateVerifyEmailToken = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(user) {
    var token;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          console.log('➡️ generateVerifyEmailToken for user:', user.id);
          _context3.prev = 1;
          _context3.next = 4;
          return generateRandomToken(32);
        case 4:
          token = _context3.sent;
          console.log('➡️ verifyEmailToken:', token);
          _context3.next = 8;
          return _tokenModel["default"].saveToken(token, user.id, (0, _moment["default"])().add(_config["default"].VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES, 'minutes').toDate(), 'verifyEmail');
        case 8:
          console.log('➡️ Saved emailVerificationToken');
          return _context3.abrupt("return", token);
        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](1);
          console.error('❌ Error in generateVerifyEmailToken:', _context3.t0);
          throw _context3.t0;
        case 16:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 12]]);
  }));
  return function generateVerifyEmailToken(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
exports.generateVerifyEmailToken = generateVerifyEmailToken;
var _default = {
  generateRandomToken: generateRandomToken,
  generateAuthTokens: generateAuthTokens,
  generateVerifyEmailToken: generateVerifyEmailToken
};
exports["default"] = _default;