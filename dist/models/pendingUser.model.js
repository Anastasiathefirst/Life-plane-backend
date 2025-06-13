"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var pendingUserSchema = new _mongoose["default"].Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  userName: {
    type: String
  },
  roles: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'Role'
  }],
  verifyToken: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now,
    expires: 3600
  } // удаляется через 1 час
}, {
  timestamps: true
});
var PendingUser = _mongoose["default"].model('PendingUser', pendingUserSchema);
var _default = PendingUser;
exports["default"] = _default;