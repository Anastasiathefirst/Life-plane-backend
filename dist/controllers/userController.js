"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.getUsers = exports.getUser = exports.deleteUser = exports["default"] = exports.createUser = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _lodash = _interopRequireDefault(require("lodash"));
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _userModel = _interopRequireDefault(require("../models/userModel"));
var _roleModel = _interopRequireDefault(require("../models/roleModel"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var createUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _userModel["default"].createUser(req.body);
        case 2:
          user = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            success: true,
            data: user
          }));
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.createUser = createUser;
var getUsers = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var filters, options, users;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          filters = _lodash["default"].pick(req.query, ['q']);
          options = _lodash["default"].pick(req.query, ['limit', 'page', 'sortBy', 'sortDirection']);
          _context2.next = 4;
          return _userModel["default"].paginate(options, 'roles.permissions', filters.q && {
            $or: [{
              firstName: {
                $regex: filters.q,
                $options: 'i'
              }
            }, {
              lastName: {
                $regex: filters.q,
                $options: 'i'
              }
            }, {
              userName: {
                $regex: filters.q,
                $options: 'i'
              }
            }]
          });
        case 4:
          users = _context2.sent;
          return _context2.abrupt("return", res.json({
            success: true,
            data: users.results,
            pagination: {
              total: users.totalResults
            }
          }));
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getUsers(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.getUsers = getUsers;
var getUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _userModel["default"].getUserByIdWithRoles(req.params.userId);
        case 2:
          user = _context3.sent;
          if (user) {
            _context3.next = 5;
            break;
          }
          throw new _apiError["default"]('User not found', _httpStatus["default"].NOT_FOUND);
        case 5:
          return _context3.abrupt("return", res.json({
            success: true,
            data: user
          }));
        case 6:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
exports.getUser = getUser;
var updateUser = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var role, user;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _roleModel["default"].getRoleByName('Super Administrator');
        case 2:
          role = _context4.sent;
          _context4.t1 = req.body.roles;
          if (!_context4.t1) {
            _context4.next = 8;
            break;
          }
          _context4.next = 7;
          return _userModel["default"].isRoleIdAlreadyExists(role.id, req.params.userId);
        case 7:
          _context4.t1 = !_context4.sent;
        case 8:
          _context4.t0 = _context4.t1;
          if (!_context4.t0) {
            _context4.next = 11;
            break;
          }
          _context4.t0 = !req.body.roles.includes(role.id);
        case 11:
          if (!_context4.t0) {
            _context4.next = 13;
            break;
          }
          throw new _apiError["default"]('Requires at least 1 user as Super Administrator', _httpStatus["default"].BAD_REQUEST);
        case 13:
          _context4.next = 15;
          return _userModel["default"].updateUserById(req.params.userId, req.body);
        case 15:
          user = _context4.sent;
          return _context4.abrupt("return", res.json({
            success: true,
            data: user
          }));
        case 17:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function updateUser(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
exports.updateUser = updateUser;
var deleteUser = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var role;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return _roleModel["default"].getRoleByName('Super Administrator');
        case 2:
          role = _context5.sent;
          _context5.next = 5;
          return _userModel["default"].isRoleIdAlreadyExists(role.id, req.params.userId);
        case 5:
          if (_context5.sent) {
            _context5.next = 7;
            break;
          }
          throw new _apiError["default"]('Requires at least 1 user as Super Administrator', _httpStatus["default"].BAD_REQUEST);
        case 7:
          _context5.next = 9;
          return _userModel["default"].deleteUserById(req.params.userId);
        case 9:
          return _context5.abrupt("return", res.json({
            success: true,
            data: 'Delete user success'
          }));
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function deleteUser(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.deleteUser = deleteUser;
var _default = {
  createUser: createUser,
  getUsers: getUsers,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser
};
exports["default"] = _default;