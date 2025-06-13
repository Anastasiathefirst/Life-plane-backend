"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var supportMessageSchema = new _mongoose["default"].Schema({
  userEmail: String,
  message: String
});
var SupportMessage = _mongoose["default"].model('SupportMessage', supportMessageSchema);
var _default = SupportMessage;
exports["default"] = _default;