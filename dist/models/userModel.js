"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _paginatePlugin = _interopRequireDefault(require("./plugins/paginatePlugin"));
var _toJSONPlugin = _interopRequireDefault(require("./plugins/toJSONPlugin"));
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _roleModel = _interopRequireDefault(require("./roleModel"));
var _tokenModel = _interopRequireDefault(require("./tokenModel"));
var _config = _interopRequireDefault(require("../config/config"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var userSchema = _mongoose["default"].Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    "private": true,
    minlength: 8,
    maxlength: 128
  },
  avatar: {
    type: String,
    "default": 'avatar.png'
  },
  confirmed: {
    type: Boolean,
    "default": false
  },
  verifyToken: {
    type: String,
    "private": true
  },
  verifyTokenExpires: {
    type: Date,
    "private": true
  },
  resetToken: {
    type: String,
    "private": true
  },
  resetTokenExpires: {
    type: Date,
    "private": true
  },
  roles: [{
    type: _mongoose["default"].SchemaTypes.ObjectId,
    ref: 'roles'
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function transform(doc, ret) {
      delete ret.password;
      delete ret.verifyToken;
      delete ret.verifyTokenExpires;
      delete ret.resetToken;
      delete ret.resetTokenExpires;
      return ret;
    }
  }
});
userSchema.plugin(_toJSONPlugin["default"]);
userSchema.plugin(_paginatePlugin["default"]);
var UserClass = /*#__PURE__*/function () {
  function UserClass() {
    (0, _classCallCheck2["default"])(this, UserClass);
  }
  (0, _createClass2["default"])(UserClass, [{
    key: "isPasswordMatch",
    value: function () {
      var _isPasswordMatch = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(password) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", _bcryptjs["default"].compare(password, this.password));
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function isPasswordMatch(_x) {
        return _isPasswordMatch.apply(this, arguments);
      }
      return isPasswordMatch;
    }()
  }, {
    key: "saveRefreshToken",
    value: function () {
      var _saveRefreshToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(token, expires) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _tokenModel["default"].saveToken(token, this._id, expires, 'refresh');
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function saveRefreshToken(_x2, _x3) {
        return _saveRefreshToken.apply(this, arguments);
      }
      return saveRefreshToken;
    }()
  }, {
    key: "createVerifyToken",
    value: function () {
      var _createVerifyToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var verifyToken;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              verifyToken = crypto.randomBytes(32).toString('hex');
              this.verifyToken = verifyToken;
              this.verifyTokenExpires = Date.now() + _config["default"].VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000;
              _context3.next = 5;
              return this.save();
            case 5:
              return _context3.abrupt("return", verifyToken);
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function createVerifyToken() {
        return _createVerifyToken.apply(this, arguments);
      }
      return createVerifyToken;
    }()
  }, {
    key: "createPasswordResetToken",
    value: function () {
      var _createPasswordResetToken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
        var resetToken;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              resetToken = crypto.randomBytes(32).toString('hex');
              this.resetToken = resetToken;
              this.resetTokenExpires = Date.now() + _config["default"].RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES * 60 * 1000;
              _context4.next = 5;
              return this.save();
            case 5:
              return _context4.abrupt("return", resetToken);
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function createPasswordResetToken() {
        return _createPasswordResetToken.apply(this, arguments);
      }
      return createPasswordResetToken;
    }()
  }], [{
    key: "isEmailTaken",
    value: function () {
      var _isEmailTaken = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(email, excludeUserId) {
        var user;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.findOne({
                email: email,
                _id: {
                  $ne: excludeUserId
                }
              });
            case 2:
              user = _context5.sent;
              return _context5.abrupt("return", !!user);
            case 4:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function isEmailTaken(_x4, _x5) {
        return _isEmailTaken.apply(this, arguments);
      }
      return isEmailTaken;
    }()
  }, {
    key: "getUserById",
    value: function () {
      var _getUserById = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(id) {
        var user;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return this.findById(id).exec();
            case 2:
              user = _context6.sent;
              if (user) {
                _context6.next = 5;
                break;
              }
              throw new _apiError["default"]('User not found', _httpStatus["default"].NOT_FOUND);
            case 5:
              return _context6.abrupt("return", user);
            case 6:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function getUserById(_x6) {
        return _getUserById.apply(this, arguments);
      }
      return getUserById;
    }()
  }, {
    key: "getUserByIdWithRoles",
    value: function () {
      var _getUserByIdWithRoles = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(id) {
        var user;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.findById(id).populate({
                path: 'roles',
                select: 'name description permissions'
              }).exec();
            case 2:
              user = _context7.sent;
              if (user) {
                _context7.next = 5;
                break;
              }
              throw new _apiError["default"]('User not found', _httpStatus["default"].NOT_FOUND);
            case 5:
              return _context7.abrupt("return", user);
            case 6:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function getUserByIdWithRoles(_x7) {
        return _getUserByIdWithRoles.apply(this, arguments);
      }
      return getUserByIdWithRoles;
    }()
  }, {
    key: "getUserByEmail",
    value: function () {
      var _getUserByEmail = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(email) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              return _context8.abrupt("return", this.findOne({
                email: email
              }).exec());
            case 1:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function getUserByEmail(_x8) {
        return _getUserByEmail.apply(this, arguments);
      }
      return getUserByEmail;
    }()
  }, {
    key: "createUser",
    value: function () {
      var _createUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(userData) {
        var rolesExist;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return this.isEmailTaken(userData.email);
            case 2:
              if (!_context9.sent) {
                _context9.next = 4;
                break;
              }
              throw new _apiError["default"]('Email already taken', _httpStatus["default"].BAD_REQUEST);
            case 4:
              if (!(userData.roles && userData.roles.length > 0)) {
                _context9.next = 10;
                break;
              }
              _context9.next = 7;
              return _roleModel["default"].countDocuments({
                _id: {
                  $in: userData.roles
                }
              });
            case 7:
              rolesExist = _context9.sent;
              if (!(rolesExist !== userData.roles.length)) {
                _context9.next = 10;
                break;
              }
              throw new _apiError["default"]('One or more roles do not exist', _httpStatus["default"].BAD_REQUEST);
            case 10:
              return _context9.abrupt("return", this.create(userData));
            case 11:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function createUser(_x9) {
        return _createUser.apply(this, arguments);
      }
      return createUser;
    }()
  }, {
    key: "updateUserById",
    value: function () {
      var _updateUserById = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(userId, updateBody) {
        var user, rolesExist;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return this.getUserById(userId);
            case 2:
              user = _context10.sent;
              _context10.t0 = updateBody.email;
              if (!_context10.t0) {
                _context10.next = 8;
                break;
              }
              _context10.next = 7;
              return this.isEmailTaken(updateBody.email, userId);
            case 7:
              _context10.t0 = _context10.sent;
            case 8:
              if (!_context10.t0) {
                _context10.next = 10;
                break;
              }
              throw new _apiError["default"]('Email already taken', _httpStatus["default"].BAD_REQUEST);
            case 10:
              if (!(updateBody.roles && updateBody.roles.length > 0)) {
                _context10.next = 16;
                break;
              }
              _context10.next = 13;
              return _roleModel["default"].countDocuments({
                _id: {
                  $in: updateBody.roles
                }
              });
            case 13:
              rolesExist = _context10.sent;
              if (!(rolesExist !== updateBody.roles.length)) {
                _context10.next = 16;
                break;
              }
              throw new _apiError["default"]('One or more roles do not exist', _httpStatus["default"].BAD_REQUEST);
            case 16:
              Object.assign(user, updateBody);
              _context10.next = 19;
              return user.save();
            case 19:
              return _context10.abrupt("return", user);
            case 20:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this);
      }));
      function updateUserById(_x10, _x11) {
        return _updateUserById.apply(this, arguments);
      }
      return updateUserById;
    }()
  }, {
    key: "deleteUserById",
    value: function () {
      var _deleteUserById = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(userId) {
        var user;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return this.getUserById(userId);
            case 2:
              user = _context11.sent;
              _context11.next = 5;
              return user.remove();
            case 5:
              return _context11.abrupt("return", user);
            case 6:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this);
      }));
      function deleteUserById(_x12) {
        return _deleteUserById.apply(this, arguments);
      }
      return deleteUserById;
    }()
  }]);
  return UserClass;
}();
userSchema.pre('save', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(next) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          if (!this.isModified('password')) {
            _context12.next = 4;
            break;
          }
          _context12.next = 3;
          return _bcryptjs["default"].hash(this.password, 10);
        case 3:
          this.password = _context12.sent;
        case 4:
          next();
        case 5:
        case "end":
          return _context12.stop();
      }
    }, _callee12, this);
  }));
  return function (_x13) {
    return _ref.apply(this, arguments);
  };
}());
userSchema.pre('remove', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(next) {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return _tokenModel["default"].deleteMany({
            user: this._id
          });
        case 2:
          next();
        case 3:
        case "end":
          return _context13.stop();
      }
    }, _callee13, this);
  }));
  return function (_x14) {
    return _ref2.apply(this, arguments);
  };
}());
userSchema.loadClass(UserClass);
var User = _mongoose["default"].model('users', userSchema);
var _default = User;
exports["default"] = _default;