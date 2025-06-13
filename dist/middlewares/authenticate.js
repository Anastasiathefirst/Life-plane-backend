"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _passport = _interopRequireDefault(require("passport"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _roleModel = _interopRequireDefault(require("../models/roleModel"));
var verifyCallback = function verifyCallback(req, resolve, reject, requiredRights) {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(err, user, info) {
      var userRights, roles, hasRequiredRights;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(err || info || !user)) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return", reject(new _apiError["default"](_httpStatus["default"][_httpStatus["default"].UNAUTHORIZED], _httpStatus["default"].UNAUTHORIZED)));
          case 2:
            req.user = user;
            if (!requiredRights.length) {
              _context.next = 12;
              break;
            }
            userRights = [];
            _context.next = 7;
            return _roleModel["default"].find({
              _id: {
                $in: user.roles
              }
            }).populate('permissions');
          case 7:
            roles = _context.sent;
            roles.forEach(function (i) {
              i.permissions.forEach(function (j) {
                userRights.push("".concat(j.controller, ":").concat(j.action));
              });
            });
            hasRequiredRights = requiredRights.every(function (r) {
              return userRights.includes(r);
            }); //console.log('requiredRights: ', requiredRights);
            //console.log('userRights: ', userRights);
            //console.log('boolean: ', hasRequiredRights);
            if (hasRequiredRights) {
              _context.next = 12;
              break;
            }
            return _context.abrupt("return", reject(new _apiError["default"]('Resource access denied', _httpStatus["default"].FORBIDDEN)));
          case 12:
            return _context.abrupt("return", resolve());
          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};
var authenticate = function authenticate() {
  for (var _len = arguments.length, requiredRights = new Array(_len), _key = 0; _key < _len; _key++) {
    requiredRights[_key] = arguments[_key];
  }
  return /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              _passport["default"].authenticate('jwt', {
                session: false
              }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
            }).then(function () {
              return next();
            })["catch"](function (err) {
              return next(err);
            }));
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }();
};
var _default = authenticate;
exports["default"] = _default;