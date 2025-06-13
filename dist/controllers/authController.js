"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyEmail = exports.signup = exports.signin = exports.sendVerificationEmail = exports.resetPassword = exports.refreshTokens = exports.forgotPassword = exports["default"] = exports.current = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _tokenService = _interopRequireDefault(require("../services/tokenService"));
var _emailService = _interopRequireDefault(require("../services/emailService"));
var _userModel = _interopRequireDefault(require("../models/userModel"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var _roleModel = _interopRequireDefault(require("../models/roleModel"));
var sphereController = _interopRequireWildcard(require("./sphereController"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var signup = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, email, password, existingUser, role, user, verifyToken, tokens;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('➡️ Signup request headers:', JSON.stringify(req.headers));
          console.log('➡️ Signup raw body:', JSON.stringify(req.body));
          if (req.is('application/json')) {
            _context.next = 5;
            break;
          }
          throw new _apiError["default"]('Invalid Content-Type', _httpStatus["default"].BAD_REQUEST);
        case 5:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          if (!(!email || !password)) {
            _context.next = 8;
            break;
          }
          throw new _apiError["default"]('Missing required fields', _httpStatus["default"].BAD_REQUEST);
        case 8:
          console.log('🔍 Checking existing user for email:', email);
          _context.next = 11;
          return _userModel["default"].getUserByEmail(email);
        case 11:
          existingUser = _context.sent;
          if (!existingUser) {
            _context.next = 15;
            break;
          }
          console.warn('⚠️ User already exists:', email);
          throw new _apiError["default"]('Пользователь уже существует', _httpStatus["default"].CONFLICT);
        case 15:
          console.log('🔍 Getting User role');
          _context.next = 18;
          return _roleModel["default"].getRoleByName('User');
        case 18:
          role = _context.sent;
          if (role) {
            _context.next = 21;
            break;
          }
          throw new _apiError["default"]('Role not found', _httpStatus["default"].INTERNAL_SERVER_ERROR);
        case 21:
          console.log('🛠 Creating new user');
          _context.next = 24;
          return _userModel["default"].createUser({
            email: email,
            password: password,
            roles: [role.id],
            confirmed: false
          });
        case 24:
          user = _context.sent;
          if (user) {
            _context.next = 27;
            break;
          }
          throw new _apiError["default"]('Ошибка создания пользователя', _httpStatus["default"].INTERNAL_SERVER_ERROR);
        case 27:
          console.log('🔑 Generating verification token');
          _context.next = 30;
          return _tokenService["default"].generateVerifyEmailToken(user);
        case 30:
          verifyToken = _context.sent;
          console.log('🔑 Generating auth tokens');
          _context.next = 34;
          return _tokenService["default"].generateAuthTokens(user);
        case 34:
          tokens = _context.sent;
          console.log('📨 Sending verification email');
          _context.next = 38;
          return _emailService["default"].sendVerificationEmail(user.email, verifyToken);
        case 38:
          console.log('🌐 Creating initial spheres');
          _context.next = 41;
          return sphereController.createInitialSpheres(user.id);
        case 41:
          console.log('✅ User registration successful');
          return _context.abrupt("return", res.status(_httpStatus["default"].CREATED).json({
            success: true,
            data: {
              user: {
                id: user.id,
                email: user.email
              },
              tokens: tokens
            }
          }));
        case 45:
          _context.prev = 45;
          _context.t0 = _context["catch"](0);
          console.error('🔥 Error in signup:', _context.t0);
          res.status(_context.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR).json({
            status: _context.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR,
            errors: _context.t0.message || 'Internal Server Error'
          });
        case 49:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 45]]);
  }));
  return function signup(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.signup = signup;
var verifyEmail = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var token, user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log('🔍 Verifying email token:', req.query.token);
          token = req.query.token;
          if (token) {
            _context2.next = 5;
            break;
          }
          throw new _apiError["default"]('Token is required', _httpStatus["default"].BAD_REQUEST);
        case 5:
          _context2.next = 7;
          return _userModel["default"].findOneAndUpdate({
            verifyToken: token,
            verifyTokenExpires: {
              $gt: Date.now()
            }
          }, {
            $set: {
              confirmed: true
            },
            $unset: {
              verifyToken: 1,
              verifyTokenExpires: 1
            }
          }, {
            "new": true
          });
        case 7:
          user = _context2.sent;
          if (user) {
            _context2.next = 10;
            break;
          }
          throw new _apiError["default"]('Ссылка недействительна или истек срок действия', _httpStatus["default"].BAD_REQUEST);
        case 10:
          console.log('✅ Email confirmed for:', user.email);
          return _context2.abrupt("return", res.json({
            success: true,
            message: 'Email подтверждён'
          }));
        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          console.error('❌ Error in verifyEmail:', _context2.t0);
          res.status(_context2.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR).json({
            status: _context2.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR,
            errors: _context2.t0.message || 'Internal Server Error'
          });
        case 18:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 14]]);
  }));
  return function verifyEmail(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.verifyEmail = verifyEmail;
var signin = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$body2, email, password, user, isPasswordMatch, tokens;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log('🔑 Signin request:', JSON.stringify(req.body));
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          if (!(!email || !password)) {
            _context3.next = 5;
            break;
          }
          throw new _apiError["default"]('Email and password are required', _httpStatus["default"].BAD_REQUEST);
        case 5:
          console.log('🔍 Finding user by email:', email);
          _context3.next = 8;
          return _userModel["default"].getUserByEmail(email);
        case 8:
          user = _context3.sent;
          if (user) {
            _context3.next = 11;
            break;
          }
          throw new _apiError["default"]('Неверные учетные данные', _httpStatus["default"].UNAUTHORIZED);
        case 11:
          console.log('🔐 Checking password');
          _context3.next = 14;
          return user.isPasswordMatch(password);
        case 14:
          isPasswordMatch = _context3.sent;
          if (isPasswordMatch) {
            _context3.next = 17;
            break;
          }
          throw new _apiError["default"]('Неверные учетные данные', _httpStatus["default"].UNAUTHORIZED);
        case 17:
          if (user.confirmed) {
            _context3.next = 19;
            break;
          }
          throw new _apiError["default"]('Email не подтверждён', _httpStatus["default"].UNAUTHORIZED);
        case 19:
          console.log('🔑 Generating auth tokens');
          _context3.next = 22;
          return _tokenService["default"].generateAuthTokens(user);
        case 22:
          tokens = _context3.sent;
          console.log('✅ Login successful for:', user.email);
          return _context3.abrupt("return", res.json({
            success: true,
            data: {
              user: {
                id: user.id,
                email: user.email
              },
              tokens: tokens
            }
          }));
        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](0);
          console.error('❌ Error in signin:', _context3.t0);
          res.status(_context3.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR).json({
            status: _context3.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR,
            errors: _context3.t0.message || 'Internal Server Error'
          });
        case 31:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 27]]);
  }));
  return function signin(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
exports.signin = signin;
var current = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var user;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          console.log('👤 Getting current user:', req.user.id);
          _context4.next = 4;
          return _userModel["default"].getUserByIdWithRoles(req.user.id);
        case 4:
          user = _context4.sent;
          if (user) {
            _context4.next = 7;
            break;
          }
          throw new _apiError["default"]('User not found', _httpStatus["default"].NOT_FOUND);
        case 7:
          return _context4.abrupt("return", res.json({
            success: true,
            data: user
          }));
        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.error('❌ Error in current:', _context4.t0);
          res.status(_context4.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR).json({
            status: _context4.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR,
            errors: _context4.t0.message || 'Internal Server Error'
          });
        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 10]]);
  }));
  return function current(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
exports.current = current;
var refreshTokens = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var refreshToken, user, tokens;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          console.log('🔄 Refreshing tokens with:', req.body.refreshToken);
          refreshToken = req.body.refreshToken;
          if (refreshToken) {
            _context5.next = 5;
            break;
          }
          throw new _apiError["default"]('Refresh token is required', _httpStatus["default"].BAD_REQUEST);
        case 5:
          _context5.next = 7;
          return _tokenService["default"].verifyRefreshToken(refreshToken);
        case 7:
          user = _context5.sent;
          _context5.next = 10;
          return _tokenService["default"].generateAuthTokens(user);
        case 10:
          tokens = _context5.sent;
          console.log('✅ Tokens refreshed for:', user.id);
          return _context5.abrupt("return", res.json({
            success: true,
            data: {
              tokens: tokens
            }
          }));
        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          console.error('❌ Error in refreshTokens:', _context5.t0);
          res.status(_context5.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR).json({
            status: _context5.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR,
            errors: _context5.t0.message || 'Internal Server Error'
          });
        case 19:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 15]]);
  }));
  return function refreshTokens(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.refreshTokens = refreshTokens;
var sendVerificationEmail = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var user, verifyToken;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          console.log('📨 Request to send verification email for:', req.user.id);
          _context6.next = 4;
          return _userModel["default"].getUserById(req.user.id);
        case 4:
          user = _context6.sent;
          if (user) {
            _context6.next = 7;
            break;
          }
          throw new _apiError["default"]('Пользователь не найден', _httpStatus["default"].NOT_FOUND);
        case 7:
          if (!user.confirmed) {
            _context6.next = 9;
            break;
          }
          return _context6.abrupt("return", res.json({
            success: true,
            message: 'Email уже подтверждён'
          }));
        case 9:
          _context6.next = 11;
          return _tokenService["default"].generateVerifyEmailToken(user);
        case 11:
          verifyToken = _context6.sent;
          _context6.next = 14;
          return _emailService["default"].sendVerificationEmail(user.email, verifyToken);
        case 14:
          console.log('✅ Verification email sent to:', user.email);
          return _context6.abrupt("return", res.json({
            success: true,
            message: 'Письмо отправлено'
          }));
        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](0);
          console.error('❌ Error in sendVerificationEmail:', _context6.t0);
          res.status(_context6.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR).json({
            status: _context6.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR,
            errors: _context6.t0.message || 'Internal Server Error'
          });
        case 22:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 18]]);
  }));
  return function sendVerificationEmail(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
exports.sendVerificationEmail = sendVerificationEmail;
var forgotPassword = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var email, user, resetToken;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          console.log('🔑 Forgot password request for:', req.body.email);
          email = req.body.email;
          if (email) {
            _context7.next = 5;
            break;
          }
          throw new _apiError["default"]('Email is required', _httpStatus["default"].BAD_REQUEST);
        case 5:
          _context7.next = 7;
          return _userModel["default"].getUserByEmail(email);
        case 7:
          user = _context7.sent;
          if (user) {
            _context7.next = 10;
            break;
          }
          throw new _apiError["default"]('Пользователь не найден', _httpStatus["default"].NOT_FOUND);
        case 10:
          _context7.next = 12;
          return _tokenService["default"].generateVerifyEmailToken(user);
        case 12:
          resetToken = _context7.sent;
          _context7.next = 15;
          return _emailService["default"].sendResetPasswordEmail(user.email, resetToken);
        case 15:
          console.log('✅ Reset password email sent to:', email);
          return _context7.abrupt("return", res.json({
            success: true,
            message: 'Письмо для сброса пароля отправлено'
          }));
        case 19:
          _context7.prev = 19;
          _context7.t0 = _context7["catch"](0);
          console.error('❌ Error in forgotPassword:', _context7.t0);
          res.status(_context7.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR).json({
            status: _context7.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR,
            errors: _context7.t0.message || 'Internal Server Error'
          });
        case 23:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 19]]);
  }));
  return function forgotPassword(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
exports.forgotPassword = forgotPassword;
var resetPassword = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var token, password, user;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          console.log('🔄 Resetting password with token:', req.query.token);
          token = req.query.token;
          password = req.body.password;
          if (!(!token || !password)) {
            _context8.next = 6;
            break;
          }
          throw new _apiError["default"]('Token and password are required', _httpStatus["default"].BAD_REQUEST);
        case 6:
          _context8.next = 8;
          return _userModel["default"].findOneAndUpdate({
            resetToken: token,
            resetTokenExpires: {
              $gt: Date.now()
            }
          }, {
            password: password,
            $unset: {
              resetToken: 1,
              resetTokenExpires: 1
            }
          }, {
            "new": true
          });
        case 8:
          user = _context8.sent;
          if (user) {
            _context8.next = 11;
            break;
          }
          throw new _apiError["default"]('Недействительный или просроченный токен', _httpStatus["default"].BAD_REQUEST);
        case 11:
          console.log('✅ Password reset for:', user.email);
          return _context8.abrupt("return", res.json({
            success: true,
            message: 'Пароль успешно обновлён'
          }));
        case 15:
          _context8.prev = 15;
          _context8.t0 = _context8["catch"](0);
          console.error('❌ Error in resetPassword:', _context8.t0);
          res.status(_context8.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR).json({
            status: _context8.t0.status || _httpStatus["default"].INTERNAL_SERVER_ERROR,
            errors: _context8.t0.message || 'Internal Server Error'
          });
        case 19:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 15]]);
  }));
  return function resetPassword(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();
exports.resetPassword = resetPassword;
var _default = {
  signup: signup,
  signin: signin,
  current: current,
  refreshTokens: refreshTokens,
  sendVerificationEmail: sendVerificationEmail,
  verifyEmail: verifyEmail,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword
};
exports["default"] = _default;