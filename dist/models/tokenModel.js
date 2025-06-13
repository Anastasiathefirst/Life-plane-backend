"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var tokenSchema = new _mongoose["default"].Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    "enum": ['refresh', 'verifyEmail', 'resetPassword'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  blacklisted: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});

// Статический метод для сохранения токена
tokenSchema.statics.saveToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(token, userId, expires, type) {
    var blacklisted,
      tokenDoc,
      _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          blacklisted = _args.length > 4 && _args[4] !== undefined ? _args[4] : false;
          _context.next = 3;
          return this.create({
            token: token,
            user: userId,
            expiresAt: expires,
            type: type,
            blacklisted: blacklisted
          });
        case 3:
          tokenDoc = _context.sent;
          return _context.abrupt("return", tokenDoc);
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();
var Token = _mongoose["default"].model('Token', tokenSchema);
var _default = Token;
exports["default"] = _default;