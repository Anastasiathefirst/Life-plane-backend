"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.getUsers = exports.getUser = exports.deleteUser = exports["default"] = exports.createUser = void 0;
var _joi = _interopRequireDefault(require("joi"));
var _customValidation = require("./customValidation");
var createUser = {
  body: _joi["default"].object().keys({
    email: _joi["default"].string().required().email(),
    password: _joi["default"].string().trim().min(6).max(666).required(),
    roles: _joi["default"].array().items(_joi["default"].string().custom(_customValidation.mongoId)).min(1).max(6).unique().required(),
    avatar: _joi["default"].string().max(666)
  })
};
exports.createUser = createUser;
var getUsers = {
  query: _joi["default"].object().keys({
    q: _joi["default"].string(),
    sortBy: _joi["default"].string(),
    sortDirection: _joi["default"].string(),
    limit: _joi["default"].number().integer(),
    page: _joi["default"].number().integer()
  })
};
exports.getUsers = getUsers;
var getUser = {
  params: _joi["default"].object().keys({
    userId: _joi["default"].string().custom(_customValidation.mongoId)
  })
};
exports.getUser = getUser;
var updateUser = {
  params: _joi["default"].object().keys({
    userId: _joi["default"].string().custom(_customValidation.mongoId).required()
  }),
  body: _joi["default"].object().keys({
    email: _joi["default"].string().email(),
    password: _joi["default"].string().trim().min(6).max(666),
    roles: _joi["default"].array().items(_joi["default"].string().custom(_customValidation.mongoId)).min(1).max(6).unique(),
    avatar: _joi["default"].string().max(666)
  })
};
exports.updateUser = updateUser;
var deleteUser = {
  params: _joi["default"].object().keys({
    userId: _joi["default"].string().custom(_customValidation.mongoId)
  })
};
exports.deleteUser = deleteUser;
var _default = {
  createUser: createUser,
  getUsers: getUsers,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};
exports["default"] = _default;