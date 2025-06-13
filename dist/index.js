"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _config = _interopRequireDefault(require("./config/config"));
var _app = _interopRequireDefault(require("./app"));
var _initialData = _interopRequireDefault(require("./config/initialData"));
var _logger = _interopRequireDefault(require("./config/logger"));
require("./services/telegramBot.js");
// ⬇️ Подключаем Telegram-бота (он будет слушать, не как твои подписчики)

var server;
_mongoose["default"].Promise = global.Promise;
var db = _mongoose["default"].connection;
db.on('connecting', function () {
  _logger["default"].info('🚀 Connecting to MongoDB...');
});
db.on('error', function (err) {
  _logger["default"].error("MongoDB connection error: ".concat(err));
  _mongoose["default"].disconnect();
});
db.on('connected', function () {
  _logger["default"].info('🚀 Connected to MongoDB!');
});
db.once('open', function () {
  _logger["default"].info('🚀 MongoDB connection opened!');
});
db.on('reconnected', function () {
  _logger["default"].info('🚀 MongoDB reconnected!');
});
var connect = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _mongoose["default"].connect(_config["default"].DATABASE_URI, _config["default"].DATABASE_OPTIONS);
        case 3:
          _logger["default"].info('🚀 Connected to MongoDB end!');
          _context.next = 6;
          return (0, _initialData["default"])();
        case 6:
          _logger["default"].info('🚀 Initial MongoDB!');
          server = _app["default"].listen(_config["default"].PORT, _config["default"].HOST, function () {
            _logger["default"].info("\uD83D\uDE80 Host: http://".concat(_config["default"].HOST, ":").concat(_config["default"].PORT));
            _logger["default"].info('██████╗░░░██╗██╗███████╗');
            _logger["default"].info('██╔══██╗░██╔╝██║╚════██║');
            _logger["default"].info('██║░░██║██╔╝░██║░░███╔═╝');
            _logger["default"].info('██║░░██║███████║██╔══╝░░');
            _logger["default"].info('██████╔╝╚════██║███████╗');
            _logger["default"].info('╚═════╝░░░░░░╚═╝╚══════╝');
          });
          _context.next = 13;
          break;
        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          _logger["default"].error("MongoDB connection error: ".concat(_context.t0));
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 10]]);
  }));
  return function connect() {
    return _ref.apply(this, arguments);
  };
}();
connect();
var exitHandler = function exitHandler() {
  if (server) {
    server.close(function () {
      _logger["default"].warn('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
var unexpectedErrorHandler = function unexpectedErrorHandler(err) {
  _logger["default"].error(err);
  exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', function () {
  _logger["default"].info('SIGTERM received');
  if (server) {
    server.close();
    ы;
  }
});