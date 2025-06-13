"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyEmail = exports.updateMe = exports.signup = exports.signout = exports.signin = exports.resetPassword = exports.refreshTokens = exports.forgotPassword = exports["default"] = void 0;
var _joi = _interopRequireDefault(require("joi"));
var signup = {
  body: _joi["default"].object().keys({
    email: _joi["default"].string().email().required(),
    password: _joi["default"].string().trim().min(6).max(666).required()
  })
};
exports.signup = signup;
var signin = {
  body: _joi["default"].object().keys({
    email: _joi["default"].string().email().required(),
    password: _joi["default"].string().required()
  })
};
exports.signin = signin;
var signout = {
  body: _joi["default"].object().keys({
    refreshToken: _joi["default"].string().required()
  })
};
exports.signout = signout;
var refreshTokens = {
  body: _joi["default"].object().keys({
    refreshToken: _joi["default"].string().required()
  })
};
exports.refreshTokens = refreshTokens;
var forgotPassword = {
  body: _joi["default"].object().keys({
    email: _joi["default"].string().email().required()
  })
};
exports.forgotPassword = forgotPassword;
var resetPassword = {
  query: _joi["default"].object().keys({
    token: _joi["default"].string().required()
  }),
  body: _joi["default"].object().keys({
    password: _joi["default"].string().trim().min(6).max(666).required()
  })
};
exports.resetPassword = resetPassword;
var updateMe = {
  body: _joi["default"].object().keys({
    email: _joi["default"].string().email(),
    password: _joi["default"].string().trim().min(6).max(666),
    avatar: _joi["default"].string().max(666)
  })
};
exports.updateMe = updateMe;
var verifyEmail = {
  query: _joi["default"].object().keys({
    token: _joi["default"].string().required()
  })
};
exports.verifyEmail = verifyEmail;
var _default = {
  signup: signup,
  signin: signin,
  updateMe: updateMe,
  signout: signout,
  refreshTokens: refreshTokens,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  verifyEmail: verifyEmail
};
exports["default"] = _default;