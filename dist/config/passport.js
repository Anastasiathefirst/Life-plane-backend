"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _passportJwt = require("passport-jwt");
var _passport = _interopRequireDefault(require("passport"));
var _config = _interopRequireDefault(require("./config"));
var _userModel = _interopRequireDefault(require("../models/userModel"));
// 🔍 DEBUG LOG
console.log("🔐 JWT_SECRET used in passport strategy:", _config["default"].JWT_SECRET);
_passport["default"].use(new _passportJwt.Strategy({
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: _config["default"].JWT_SECRET,
  // 👈 HS256 секрет
  algorithms: ['HS256']
}, /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(jwtPayload, done) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _userModel["default"].getUserById(jwtPayload.sub);
        case 3:
          user = _context.sent;
          if (user) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", done(null, false));
        case 6:
          return _context.abrupt("return", done(null, user));
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", done(_context.t0, false));
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()));
var _default = _passport["default"];
exports["default"] = _default;