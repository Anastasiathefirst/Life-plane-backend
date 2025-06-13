"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _winston = _interopRequireDefault(require("winston"));
var _config = _interopRequireDefault(require("./config"));
var levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};
_winston["default"].addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
});
var logger = _winston["default"].createLogger({
  level: _config["default"].NODE_ENV === 'development' ? 'debug' : 'warn',
  levels: levels,
  format: _winston["default"].format.combine(_winston["default"].format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }), _winston["default"].format.printf(function (info) {
    return "".concat([info.timestamp], ": ").concat(info.level, ": ").concat(info.message);
  })),
  transports: [new _winston["default"].transports.File({
    level: 'error',
    filename: 'logs/error.log',
    maxsize: '10000000',
    maxFiles: '10'
  }), new _winston["default"].transports.File({
    filename: 'logs/combined.log',
    maxsize: '10000000',
    maxFiles: '10'
  }), new _winston["default"].transports.Console({
    format: _winston["default"].format.combine(_winston["default"].format.colorize({
      all: true
    }))
  })]
});
var _default = logger;
exports["default"] = _default;