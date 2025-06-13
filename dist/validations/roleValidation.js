"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRole = exports.getRoles = exports.getRole = exports.deleteRole = exports["default"] = exports.createRole = void 0;
var _joi = _interopRequireDefault(require("joi"));
var _customValidation = require("./customValidation");
var createRole = {
  body: _joi["default"].object().keys({
    name: _joi["default"].string().trim().min(2).max(66).required(),
    description: _joi["default"].string().min(2).max(666).allow(''),
    permissions: _joi["default"].array().items(_joi["default"].string().custom(_customValidation.mongoId)).unique()
  })
};
exports.createRole = createRole;
var updateRole = {
  params: _joi["default"].object().keys({
    roleId: _joi["default"].string().custom(_customValidation.mongoId).required()
  }),
  body: _joi["default"].object().keys({
    name: _joi["default"].string().trim().min(2).max(66),
    description: _joi["default"].string().min(2).max(666).allow(''),
    permissions: _joi["default"].array().items(_joi["default"].string().custom(_customValidation.mongoId)).unique()
  })
};
exports.updateRole = updateRole;
var deleteRole = {
  params: _joi["default"].object().keys({
    roleId: _joi["default"].string().custom(_customValidation.mongoId)
  })
};
exports.deleteRole = deleteRole;
var getRoles = {
  query: _joi["default"].object().keys({
    q: _joi["default"].string(),
    sortBy: _joi["default"].string(),
    sortDirection: _joi["default"].string(),
    limit: _joi["default"].number().integer(),
    page: _joi["default"].number().integer()
  })
};
exports.getRoles = getRoles;
var getRole = {
  params: _joi["default"].object().keys({
    roleId: _joi["default"].string().custom(_customValidation.mongoId)
  })
};
exports.getRole = getRole;
var _default = {
  createRole: createRole,
  getRole: getRole,
  updateRole: updateRole,
  getRoles: getRoles,
  deleteRole: deleteRole
};
exports["default"] = _default;