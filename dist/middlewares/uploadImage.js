"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _multer = _interopRequireDefault(require("multer"));
var _path = _interopRequireDefault(require("path"));
var _uuid = require("uuid");
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _fs = _interopRequireDefault(require("fs"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var storage = _multer["default"].diskStorage({
  destination: function destination(req, file, callback) {
    var dir = 'public/images';
    if (!_fs["default"].existsSync(dir)) {
      _fs["default"].mkdirSync(dir, {
        recursive: true
      });
    }
    callback(null, dir);
  },
  filename: function filename(req, file, callback) {
    callback(null, (0, _uuid.v4)() + _path["default"].extname(file.originalname));
  }
});
var upload = (0, _multer["default"])({
  storage: storage,
  limits: {
    fileSize: 6 * 1024 * 1024
  },
  fileFilter: function fileFilter(req, file, callback) {
    var ext = _path["default"].extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new _apiError["default"]('File image unsupported', _httpStatus["default"].BAD_REQUEST));
    }
    callback(null, true);
  }
}).single('image');
var uploadImage = function uploadImage(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof _multer["default"].MulterError) {
      return next(new _apiError["default"](err.message, _httpStatus["default"].BAD_REQUEST));
    } else if (err) {
      return next(err);
    }
    return next();
  });
};
var _default = uploadImage;
exports["default"] = _default;