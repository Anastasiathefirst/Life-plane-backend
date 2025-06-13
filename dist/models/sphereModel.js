"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var sphereSchema = new _mongoose["default"].Schema({
  userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    "default": 5
  },
  frequency: {
    type: String,
    "default": 'раз в неделю'
  },
  criticality: {
    type: Number,
    "default": 5
  },
  lastUpdated: {
    type: Date,
    "default": Date.now
  }
});
var Sphere = _mongoose["default"].model('Sphere', sphereSchema);
var _default = Sphere;
exports["default"] = _default;