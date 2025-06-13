"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notFound = exports.handler = exports["default"] = exports.converter = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var _joi = _interopRequireDefault(require("joi"));
var _config = _interopRequireDefault(require("../config/config"));
var _logger = _interopRequireDefault(require("../config/logger"));
var _apiError2 = _interopRequireDefault(require("../utils/apiError"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var converter = function converter(err, req, res, next) {
  if (err instanceof _joi["default"].ValidationError) {
    var errorMessage = err.details.map(function (d) {
      return {
        message: d.message,
        location: d.path[1],
        locationType: d.path[0]
      };
    });
    var apiError = new _apiError2["default"](errorMessage, _httpStatus["default"].BAD_REQUEST);
    apiError.stack = err.stack;
    return next(apiError);
  } else if (!(err instanceof _apiError2["default"])) {
    var status = err.status || _httpStatus["default"].INTERNAL_SERVER_ERROR;
    var message = err.message || _httpStatus["default"][status];
    var _apiError = new _apiError2["default"](message, status, false);
    _apiError.stack = err.stack;
    _apiError.message = [{
      message: err.message
    }];
    return next(_apiError);
  }
  err.message = [{
    message: err.message
  }];
  return next(err);
};
exports.converter = converter;
var notFound = function notFound(req, res, next) {
  return next(new _apiError2["default"](_httpStatus["default"][_httpStatus["default"].NOT_FOUND], _httpStatus["default"].NOT_FOUND));
};
exports.notFound = notFound;
var handler = function handler(err, req, res, next) {
  var status = err.status,
    message = err.message;
  if (_config["default"].NODE_ENV === 'production' && !err.isOperational) {
    status = _httpStatus["default"].INTERNAL_SERVER_ERROR;
    message = _httpStatus["default"][_httpStatus["default"].INTERNAL_SERVER_ERROR];
  }
  _logger["default"].error(err.stack);
  return res.status(status).json(_objectSpread({
    status: status,
    errors: message
  }, _config["default"].NODE_ENV === 'development' && {
    stack: err.stack
  }));
};
exports.handler = handler;
var _default = {
  converter: converter,
  notFound: notFound,
  handler: handler
};
exports["default"] = _default;