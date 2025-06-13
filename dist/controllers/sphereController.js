"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMySpheres = exports.createOrUpdateSphere = exports.createInitialSpheres = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _sphereModel = _interopRequireDefault(require("../models/sphereModel"));
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _httpStatus = _interopRequireDefault(require("http-status"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// Получить все сферы пользователя
var getMySpheres = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var spheres;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _sphereModel["default"].find({
            userId: req.user.id
          });
        case 2:
          spheres = _context.sent;
          res.json({
            success: true,
            data: spheres
          });
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getMySpheres(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// Создать или обновить сферу
exports.getMySpheres = getMySpheres;
var createOrUpdateSphere = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$body, name, value, criticality, frequency, sphere;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, value = _req$body.value, criticality = _req$body.criticality, frequency = _req$body.frequency;
          if (name) {
            _context2.next = 3;
            break;
          }
          throw new _apiError["default"]('Название сферы обязательно', _httpStatus["default"].BAD_REQUEST);
        case 3:
          _context2.next = 5;
          return _sphereModel["default"].findOneAndUpdate({
            userId: req.user.id,
            name: name
          }, {
            $set: {
              value: value !== null && value !== void 0 ? value : 5,
              criticality: criticality !== null && criticality !== void 0 ? criticality : 5,
              frequency: frequency !== null && frequency !== void 0 ? frequency : 'раз в неделю',
              lastUpdated: new Date()
            }
          }, {
            upsert: true,
            "new": true
          });
        case 5:
          sphere = _context2.sent;
          res.json({
            success: true,
            data: sphere
          });
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function createOrUpdateSphere(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// Инициализация сфер при создании аккаунта
exports.createOrUpdateSphere = createOrUpdateSphere;
var createInitialSpheres = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(userId) {
    var defaultSpheres, spheres;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          defaultSpheres = [{
            name: 'Работа',
            value: 5,
            frequency: 'ежедневно',
            criticality: 3
          }, {
            name: 'Саморазвитие',
            value: 5,
            frequency: '5 дней в неделю',
            criticality: 4
          }, {
            name: 'Здоровье',
            value: 5,
            frequency: 'раз в 2 дня',
            criticality: 6
          }, {
            name: 'Семья',
            value: 5,
            frequency: 'раз в неделю',
            criticality: 7
          }, {
            name: 'Ценности',
            value: 5,
            frequency: 'раз в месяц',
            criticality: 8
          }];
          spheres = defaultSpheres.map(function (s) {
            return _objectSpread(_objectSpread({}, s), {}, {
              userId: userId
            });
          });
          _context3.next = 4;
          return _sphereModel["default"].insertMany(spheres);
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function createInitialSpheres(_x5) {
    return _ref3.apply(this, arguments);
  };
}();
exports.createInitialSpheres = createInitialSpheres;