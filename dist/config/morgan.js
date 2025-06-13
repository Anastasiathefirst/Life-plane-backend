"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _morgan = _interopRequireDefault(require("morgan"));
var _logger = _interopRequireDefault(require("./logger"));
var morganHTTP = (0, _morgan["default"])('combined', {
  stream: {
    write: function write(message) {
      return _logger["default"].http(message.trim());
    }
  }
});
var _default = morganHTTP;
exports["default"] = _default;