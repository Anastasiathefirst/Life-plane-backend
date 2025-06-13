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
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _paginatePlugin = _interopRequireDefault(require("./plugins/paginatePlugin"));
var _toJSONPlugin = _interopRequireDefault(require("./plugins/toJSONPlugin"));
var _permissionModel = _interopRequireDefault(require("./permissionModel"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var roleSchema = _mongoose["default"].Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    "default": ''
  },
  permissions: [{
    type: _mongoose["default"].SchemaTypes.ObjectId,
    ref: 'permissions'
  }]
}, {
  timestamps: true
});
roleSchema.plugin(_toJSONPlugin["default"]);
roleSchema.plugin(_paginatePlugin["default"]);
var RoleClass = /*#__PURE__*/function () {
  function RoleClass() {
    (0, _classCallCheck2["default"])(this, RoleClass);
  }
  (0, _createClass2["default"])(RoleClass, null, [{
    key: "isNameAlreadyExists",
    value: function () {
      var _isNameAlreadyExists = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(name, excludeUserId) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.findOne({
                name: name,
                _id: {
                  $ne: excludeUserId
                }
              });
            case 2:
              return _context.abrupt("return", !!_context.sent);
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function isNameAlreadyExists(_x, _x2) {
        return _isNameAlreadyExists.apply(this, arguments);
      }
      return isNameAlreadyExists;
    }()
  }, {
    key: "getRoleByName",
    value: function () {
      var _getRoleByName = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(name) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.findOne({
                name: name
              });
            case 2:
              return _context2.abrupt("return", _context2.sent);
            case 3:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getRoleByName(_x3) {
        return _getRoleByName.apply(this, arguments);
      }
      return getRoleByName;
    }()
  }, {
    key: "getRoleById",
    value: function () {
      var _getRoleById = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.findById(id);
            case 2:
              return _context3.abrupt("return", _context3.sent);
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getRoleById(_x4) {
        return _getRoleById.apply(this, arguments);
      }
      return getRoleById;
    }()
  }, {
    key: "createRole",
    value: function () {
      var _createRole = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(body) {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.isNameAlreadyExists(body.name);
            case 2:
              if (!_context5.sent) {
                _context5.next = 4;
                break;
              }
              throw new _apiError["default"]('Name already exists', _httpStatus["default"].BAD_REQUEST);
            case 4:
              if (!body.permissions) {
                _context5.next = 7;
                break;
              }
              _context5.next = 7;
              return Promise.all(body.permissions.map( /*#__PURE__*/function () {
                var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(pid) {
                  return _regenerator["default"].wrap(function _callee4$(_context4) {
                    while (1) switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _permissionModel["default"].findById(pid);
                      case 2:
                        if (_context4.sent) {
                          _context4.next = 4;
                          break;
                        }
                        throw new _apiError["default"]('Permissions not exist', _httpStatus["default"].BAD_REQUEST);
                      case 4:
                      case "end":
                        return _context4.stop();
                    }
                  }, _callee4);
                }));
                return function (_x6) {
                  return _ref.apply(this, arguments);
                };
              }()));
            case 7:
              _context5.next = 9;
              return this.create(body);
            case 9:
              return _context5.abrupt("return", _context5.sent);
            case 10:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function createRole(_x5) {
        return _createRole.apply(this, arguments);
      }
      return createRole;
    }()
  }, {
    key: "updateRoleById",
    value: function () {
      var _updateRoleById = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(roleId, body) {
        var role;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return this.getRoleById(roleId);
            case 2:
              role = _context7.sent;
              if (role) {
                _context7.next = 5;
                break;
              }
              throw new _apiError["default"]('Role not found', _httpStatus["default"].NOT_FOUND);
            case 5:
              _context7.next = 7;
              return this.isNameAlreadyExists(body.name, roleId);
            case 7:
              if (!_context7.sent) {
                _context7.next = 9;
                break;
              }
              throw new _apiError["default"]('Name already exists', _httpStatus["default"].BAD_REQUEST);
            case 9:
              if (!body.permissions) {
                _context7.next = 12;
                break;
              }
              _context7.next = 12;
              return Promise.all(body.permissions.map( /*#__PURE__*/function () {
                var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(pid) {
                  return _regenerator["default"].wrap(function _callee6$(_context6) {
                    while (1) switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return _permissionModel["default"].findById(pid);
                      case 2:
                        if (_context6.sent) {
                          _context6.next = 4;
                          break;
                        }
                        throw new _apiError["default"]('Permissions not exist', _httpStatus["default"].BAD_REQUEST);
                      case 4:
                      case "end":
                        return _context6.stop();
                    }
                  }, _callee6);
                }));
                return function (_x9) {
                  return _ref2.apply(this, arguments);
                };
              }()));
            case 12:
              Object.assign(role, body);
              _context7.next = 15;
              return role.save();
            case 15:
              return _context7.abrupt("return", _context7.sent);
            case 16:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function updateRoleById(_x7, _x8) {
        return _updateRoleById.apply(this, arguments);
      }
      return updateRoleById;
    }()
  }, {
    key: "deleteRoleById",
    value: function () {
      var _deleteRoleById = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(roleId) {
        var role;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return this.getRoleById(roleId);
            case 2:
              role = _context8.sent;
              if (role) {
                _context8.next = 5;
                break;
              }
              throw new _apiError["default"]('Role not found', _httpStatus["default"].NOT_FOUND);
            case 5:
              _context8.next = 7;
              return role.remove();
            case 7:
              return _context8.abrupt("return", _context8.sent);
            case 8:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function deleteRoleById(_x10) {
        return _deleteRoleById.apply(this, arguments);
      }
      return deleteRoleById;
    }()
  }]);
  return RoleClass;
}();
roleSchema.loadClass(RoleClass);
var Role = _mongoose["default"].model('roles', roleSchema);
var _default = Role;
exports["default"] = _default;