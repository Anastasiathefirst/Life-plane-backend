"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _authRoute = _interopRequireDefault(require("./authRoute"));
var _userRoute = _interopRequireDefault(require("./userRoute"));
var _roleRoute = _interopRequireDefault(require("./roleRoute"));
var _imageRoute = _interopRequireDefault(require("./imageRoute"));
var _sphere = _interopRequireDefault(require("./sphere.route"));
var _support = _interopRequireDefault(require("../support.js"));
// 👈 добавили поддержку

var router = (0, _express.Router)();
router.use('/auth', _authRoute["default"]);
router.use('/users', _userRoute["default"]);
router.use('/roles', _roleRoute["default"]);
router.use('/images', _imageRoute["default"]);
router.use('/spheres', _sphere["default"]);
router.use('/support', _support["default"]); // 👈 подключили поддержку
var _default = router;
exports["default"] = _default;