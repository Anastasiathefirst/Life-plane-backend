"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _catchAsync = _interopRequireDefault(require("../../utils/catchAsync"));
var _imageController = _interopRequireDefault(require("../../controllers/imageController"));
var _uploadImage = _interopRequireDefault(require("../../middlewares/uploadImage"));
var _authenticate = _interopRequireDefault(require("../../middlewares/authenticate"));
var router = (0, _express.Router)();
router.post('/upload', (0, _authenticate["default"])(), _uploadImage["default"], (0, _catchAsync["default"])(_imageController["default"].uploadImage));
var _default = router;
exports["default"] = _default;