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
var _userValidation = _interopRequireDefault(require("../../validations/userValidation"));
var _userController = _interopRequireDefault(require("../../controllers/userController"));
var router = (0, _express.Router)();
router.get('/', (0, _authenticate["default"])('user:read'), (0, _validate["default"])(_userValidation["default"].getUsers), (0, _catchAsync["default"])(_userController["default"].getUsers));
router.post('/', (0, _authenticate["default"])('user:create'), (0, _validate["default"])(_userValidation["default"].createUser), (0, _catchAsync["default"])(_userController["default"].createUser));
router.get('/:userId', (0, _authenticate["default"])('user:read'), (0, _validate["default"])(_userValidation["default"].getUser), (0, _catchAsync["default"])(_userController["default"].getUser));
router.put('/:userId', (0, _authenticate["default"])('user:update'), (0, _validate["default"])(_userValidation["default"].updateUser), (0, _catchAsync["default"])(_userController["default"].updateUser));
router["delete"]('/:userId', (0, _authenticate["default"])('user:delete'), (0, _validate["default"])(_userValidation["default"].deleteUser), (0, _catchAsync["default"])(_userController["default"].deleteUser));
var _default = router;
exports["default"] = _default;