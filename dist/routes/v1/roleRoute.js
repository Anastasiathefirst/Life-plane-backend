"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _catchAsync = _interopRequireDefault(require("../../utils/catchAsync"));
var _validate = _interopRequireDefault(require("../../middlewares/validate"));
var _authenticate = _interopRequireDefault(require("../../middlewares/authenticate"));
var _roleValidation = _interopRequireDefault(require("../../validations/roleValidation"));
var _roleController = _interopRequireDefault(require("../../controllers/roleController"));
var router = (0, _express.Router)();
router.get('/', (0, _authenticate["default"])('role:read'), (0, _validate["default"])(_roleValidation["default"].getRoles), (0, _catchAsync["default"])(_roleController["default"].getRoles));
router.post('/', (0, _authenticate["default"])('role:create'), (0, _validate["default"])(_roleValidation["default"].createRole), (0, _catchAsync["default"])(_roleController["default"].createRole));
router.get('/:roleId', (0, _authenticate["default"])('role:read'), (0, _validate["default"])(_roleValidation["default"].getRole), (0, _catchAsync["default"])(_roleController["default"].getRole));
router.put('/:roleId', (0, _authenticate["default"])('role:update'), (0, _validate["default"])(_roleValidation["default"].updateRole), (0, _catchAsync["default"])(_roleController["default"].updateRole));
router["delete"]('/:roleId', (0, _authenticate["default"])('role:delete'), (0, _validate["default"])(_roleValidation["default"].deleteRole), (0, _catchAsync["default"])(_roleController["default"].deleteRole));
var _default = router;
exports["default"] = _default;