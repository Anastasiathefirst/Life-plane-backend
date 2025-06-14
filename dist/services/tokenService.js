"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRandomToken = exports.generateAuthTokens = exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _moment = _interopRequireDefault(require("moment"));
var _config = _interopRequireDefault(require("../config/config"));
var _jwtService = _interopRequireDefault(require("./jwtService"));
var _crypto = _interopRequireDefault(require("crypto"));
var _tokenModel = _interopRequireDefault(require("../models/tokenModel"));
var generateRandomToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var length,
      _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          length = _args.length > 0 && _args[0] !== undefined ? _args[0] : 32;
          return _context.abrupt("return", _crypto["default"].randomBytes(length).toString('hex'));
        case 2:
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
          accessTokenExpires = (0, _moment["default"])().add(_config["default"].JWT_ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
          _context2.next = 3;
          return _jwtService["default"].sign(user.id, accessTokenExpires, _config["default"].JWT_ACCESS_TOKEN_SECRET_PRIVATE);
        case 3:
          accessToken = _context2.sent;
          refreshTokenExpires = (0, _moment["default"])().add(_config["default"].REFRESH_TOKEN_EXPIRATION_DAYS, 'days');
          _context2.next = 7;
          return generateRandomToken();
        case 7:
          refreshToken = _context2.sent;
          _context2.next = 10;
          return _tokenModel["default"].saveToken(refreshToken, user.id, refreshTokenExpires.toDate(), 'refresh');
        case 10:
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
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function generateAuthTokens(_x) {
    return _ref2.apply(this, arguments);
  };
}();
exports.generateAuthTokens = generateAuthTokens;
var _default = {
  generateRandomToken: generateRandomToken,
  generateAuthTokens: generateAuthTokens
};
exports["default"] = _default;