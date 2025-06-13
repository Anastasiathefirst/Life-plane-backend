"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verify = exports.sign = exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = _interopRequireDefault(require("../config/config"));
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _httpStatus = _interopRequireDefault(require("http-status"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var sign = function sign(userId, expires) {
  var secret = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _config["default"].JWT_SECRET;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  try {
    var payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expires.valueOf() / 1000)
    };
    return _jsonwebtoken["default"].sign(payload, secret, _objectSpread({
      algorithm: 'HS256'
    }, options));
  } catch (error) {
    console.error('❌ JWT signing error:', error);
    throw new _apiError["default"]('Token generation failed', _httpStatus["default"].INTERNAL_SERVER_ERROR);
  }
};
exports.sign = sign;
var verify = function verify(token) {
  var secret = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _config["default"].JWT_SECRET;
  try {
    return _jsonwebtoken["default"].verify(token, secret, {
      algorithms: ['HS256']
    });
  } catch (error) {
    console.error('❌ JWT verification error:', error);
    throw new _apiError["default"]('Invalid token', _httpStatus["default"].UNAUTHORIZED);
  }
};
exports.verify = verify;
var _default = {
  sign: sign,
  verify: verify
};
exports["default"] = _default;