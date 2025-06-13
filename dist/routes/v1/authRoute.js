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
var _authValidation = _interopRequireDefault(require("../../validations/authValidation"));
var _authController = _interopRequireDefault(require("../../controllers/authController"));
var router = (0, _express.Router)();
router.post('/signup', (0, _validate["default"])(_authValidation["default"].signup), (0, _catchAsync["default"])(_authController["default"].signup));
router.post('/signin', (0, _validate["default"])(_authValidation["default"].signin), (0, _catchAsync["default"])(_authController["default"].signin));
router.get('/current', (0, _authenticate["default"])(), (0, _catchAsync["default"])(_authController["default"].current));
router.get('/me', (0, _authenticate["default"])(), (0, _catchAsync["default"])(_authController["default"].getMe));
router.put('/me', (0, _authenticate["default"])(), (0, _validate["default"])(_authValidation["default"].updateMe), (0, _catchAsync["default"])(_authController["default"].updateMe));
router.post('/signout', (0, _validate["default"])(_authValidation["default"].signout), (0, _catchAsync["default"])(_authController["default"].signout));
router.post('/refresh-tokens', (0, _validate["default"])(_authValidation["default"].refreshTokens), (0, _catchAsync["default"])(_authController["default"].refreshTokens));

// 🎯 Добавленные руты для подтверждения почты
router.post('/send-verification-email', (0, _authenticate["default"])(), (0, _catchAsync["default"])(_authController["default"].sendVerificationEmail));
router.get('/verify-email', (0, _catchAsync["default"])(_authController["default"].verifyEmail));
router.post('/forgot-password', (0, _validate["default"])(_authValidation["default"].forgotPassword), (0, _catchAsync["default"])(_authController["default"].forgotPassword));
router.post('/reset-password', (0, _validate["default"])(_authValidation["default"].resetPassword), (0, _catchAsync["default"])(_authController["default"].resetPassword));
var _default = router;
exports["default"] = _default;