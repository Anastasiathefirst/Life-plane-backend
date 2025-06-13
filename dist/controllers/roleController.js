"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRole = exports.getRoles = exports.getRole = exports.deleteRole = exports["default"] = exports.createRole = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _lodash = _interopRequireDefault(require("lodash"));
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _userModel = _interopRequireDefault(require("../models/userModel"));
var _roleModel = _interopRequireDefault(require("../models/roleModel"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var createRole = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var role;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _roleModel["default"].createRole(req.body);
        case 2:
          role = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            success: true,
            data: role
          }));
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createRole(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.createRole = createRole;
var getRole = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var role;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _roleModel["default"].getRoleById(req.params.roleId);
        case 2:
          role = _context2.sent;
          if (role) {
            _context2.next = 5;
            break;
          }
          throw new _apiError["default"]('Role not found', _httpStatus["default"].NOT_FOUND);
        case 5:
          return _context2.abrupt("return", res.json({
            success: true,
            data: role
          }));
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getRole(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.getRole = getRole;
var updateRole = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var role;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _roleModel["default"].updateRoleById(req.params.roleId, req.body);
        case 2:
          role = _context3.sent;
          return _context3.abrupt("return", res.json({
            success: true,
            data: role
          }));
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function updateRole(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
exports.updateRole = updateRole;
var getRoles = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var filters, options, roles;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          filters = _lodash["default"].pick(req.query, ['q']);
          options = _lodash["default"].pick(req.query, ['limit', 'page', 'sortBy', 'sortDirection']);
          _context4.next = 4;
          return _roleModel["default"].paginate(options, 'permissions', filters.q && {
            $or: [{
              name: {
                $regex: filters.q,
                $options: 'i'
              }
            }, {
              description: {
                $regex: filters.q,
                $options: 'i'
              }
            }]
          });
        case 4:
          roles = _context4.sent;
          return _context4.abrupt("return", res.json({
            success: true,
            data: roles.results,
            pagination: {
              total: roles.totalResults
            }
          }));
        case 6:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getRoles(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
exports.getRoles = getRoles;
var deleteRole = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return _userModel["default"].isRoleIdAlreadyExists(req.params.roleId);
        case 2:
          if (!_context5.sent) {
            _context5.next = 4;
            break;
          }
          throw new _apiError["default"]('A role cannot be deleted if associated with users', _httpStatus["default"].BAD_REQUEST);
        case 4:
          _context5.next = 6;
          return _roleModel["default"].deleteRoleById(req.params.roleId);
        case 6:
          return _context5.abrupt("return", res.json({
            success: true,
            data: {}
          }));
        case 7:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function deleteRole(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.deleteRole = deleteRole;
var _default = {
  createRole: createRole,
  getRole: getRole,
  updateRole: updateRole,
  getRoles: getRoles,
  deleteRole: deleteRole
};
exports["default"] = _default;