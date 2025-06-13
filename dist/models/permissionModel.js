"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _toJSONPlugin = _interopRequireDefault(require("./plugins/toJSONPlugin"));
var permissionSchema = _mongoose["default"].Schema({
  controller: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    "default": true
  }
}, {
  timestamps: true
});
permissionSchema.index({
  controller: 1,
  action: 1
}, {
  unique: true
});
permissionSchema.plugin(_toJSONPlugin["default"]);
var Permission = _mongoose["default"].model('permissions', permissionSchema);
var _default = Permission;
exports["default"] = _default;