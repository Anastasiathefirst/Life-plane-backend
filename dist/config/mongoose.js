"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var _config = _interopRequireDefault(require("./config"));
var _logger = _interopRequireDefault(require("./logger"));
var mongooseConnect = function mongooseConnect() {
  var reconnectTimeout = 5000;
  var connect = function connect() {
    _mongoose["default"].connect(_config["default"].DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  };
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
  db.on('disconnected', function () {
    _logger["default"].error("MongoDB disconnected! Reconnecting in ".concat(reconnectTimeout / 1000, "s..."));
    setTimeout(function () {
      return connect();
    }, reconnectTimeout);
  });
  connect();
};
var _default = mongooseConnect;
exports["default"] = _default;