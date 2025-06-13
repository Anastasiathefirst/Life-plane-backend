"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _compression = _interopRequireDefault(require("compression"));
var _helmet = _interopRequireDefault(require("helmet"));
var _cors = _interopRequireDefault(require("cors"));
var _passport = _interopRequireDefault(require("./config/passport"));
var _v = _interopRequireDefault(require("./routes/v1"));
var _error = _interopRequireDefault(require("./middlewares/error"));
var _rateLimiter = _interopRequireDefault(require("./middlewares/rateLimiter"));
var _config = _interopRequireDefault(require("./config/config"));
var _morgan = _interopRequireDefault(require("./config/morgan"));
var app = (0, _express["default"])();
if (_config["default"].NODE_ENV !== 'test') {
  app.use(_morgan["default"]);
}
app.use((0, _helmet["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _compression["default"])());
app.use((0, _cors["default"])());
app.use(_rateLimiter["default"]);
app.use(_passport["default"].initialize());
app.use(_express["default"]["static"]('public'));
app.use('/api/v1', _v["default"]); // 👈 support тоже теперь внутри v1

app.use(_error["default"].converter);
app.use(_error["default"].notFound);
app.use(_error["default"].handler);
var _default = app;
exports["default"] = _default;