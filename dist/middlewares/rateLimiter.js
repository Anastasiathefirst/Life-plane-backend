"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var rateLimiter = (0, _expressRateLimit["default"])({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 100,
  handler: function handler(req, res, next) {
    next(new _apiError["default"]('Too many requests, please try again later.', _httpStatus["default"].TOO_MANY_REQUESTS));
  }
});
var _default = rateLimiter;
exports["default"] = _default;