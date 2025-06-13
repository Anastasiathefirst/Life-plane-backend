"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _permissionModel = _interopRequireDefault(require("../models/permissionModel"));
var _roleModel = _interopRequireDefault(require("../models/roleModel"));
var _userModel = _interopRequireDefault(require("../models/userModel"));
var _logger = _interopRequireDefault(require("./logger"));
function initialData() {
  return _initialData.apply(this, arguments);
}
function _initialData() {
  _initialData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var countPermissions, countRoles, permissionsSuperAdministrator, permissionsAdministrator, permissionsModerator, countUsers, roleSuperAdministrator, roleAdministrator, roleModerator, roleUser;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _permissionModel["default"].estimatedDocumentCount();
        case 3:
          countPermissions = _context.sent;
          if (!(countPermissions === 0)) {
            _context.next = 7;
            break;
          }
          _context.next = 7;
          return _permissionModel["default"].create({
            controller: 'user',
            action: 'create'
          }, {
            controller: 'user',
            action: 'read'
          }, {
            controller: 'user',
            action: 'update'
          }, {
            controller: 'user',
            action: 'delete'
          }, {
            controller: 'role',
            action: 'create'
          }, {
            controller: 'role',
            action: 'read'
          }, {
            controller: 'role',
            action: 'update'
          }, {
            controller: 'role',
            action: 'delete'
          });
        case 7:
          _context.next = 9;
          return _roleModel["default"].estimatedDocumentCount();
        case 9:
          countRoles = _context.sent;
          if (!(countRoles === 0)) {
            _context.next = 22;
            break;
          }
          _context.next = 13;
          return _permissionModel["default"].find();
        case 13:
          permissionsSuperAdministrator = _context.sent;
          _context.next = 16;
          return _permissionModel["default"].find({
            controller: 'user'
          });
        case 16:
          permissionsAdministrator = _context.sent;
          _context.next = 19;
          return _permissionModel["default"].find({
            controller: 'user',
            action: {
              $ne: 'delete'
            }
          });
        case 19:
          permissionsModerator = _context.sent;
          _context.next = 22;
          return _roleModel["default"].create({
            name: 'Super Administrator',
            permissions: permissionsSuperAdministrator
          }, {
            name: 'Administrator',
            permissions: permissionsAdministrator
          }, {
            name: 'Moderator',
            permissions: permissionsModerator
          }, {
            name: 'User',
            permissions: []
          });
        case 22:
          _context.next = 24;
          return _userModel["default"].estimatedDocumentCount();
        case 24:
          countUsers = _context.sent;
          if (!(countUsers === 0)) {
            _context.next = 40;
            break;
          }
          _context.next = 28;
          return _roleModel["default"].findOne({
            name: 'Super Administrator'
          });
        case 28:
          roleSuperAdministrator = _context.sent;
          _context.next = 31;
          return _roleModel["default"].findOne({
            name: 'Administrator'
          });
        case 31:
          roleAdministrator = _context.sent;
          _context.next = 34;
          return _roleModel["default"].findOne({
            name: 'Moderator'
          });
        case 34:
          roleModerator = _context.sent;
          _context.next = 37;
          return _roleModel["default"].findOne({
            name: 'User'
          });
        case 37:
          roleUser = _context.sent;
          _context.next = 40;
          return _userModel["default"].create({
            firstName: 'Thuc',
            lastName: 'Nguyen',
            userName: 'superadmin',
            email: 'admjnwapviip@gmail.com',
            password: 'superadmin',
            roles: [roleSuperAdministrator, roleAdministrator, roleModerator, roleUser]
          }, {
            firstName: 'Vy',
            lastName: 'Nguyen',
            userName: 'admin',
            email: 'admin@example.com',
            password: 'admin',
            roles: [roleAdministrator]
          }, {
            firstName: 'Thuyen',
            lastName: 'Nguyen',
            userName: 'moderator',
            email: 'moderator@example.com',
            password: 'moderator',
            roles: [roleModerator]
          }, {
            firstName: 'Uyen',
            lastName: 'Nguyen',
            userName: 'user',
            email: 'user@example.com',
            password: 'user',
            roles: [roleUser]
          });
        case 40:
          _context.next = 45;
          break;
        case 42:
          _context.prev = 42;
          _context.t0 = _context["catch"](0);
          _logger["default"].error(_context.t0);
        case 45:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 42]]);
  }));
  return _initialData.apply(this, arguments);
}
var _default = initialData;
exports["default"] = _default;