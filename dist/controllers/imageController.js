"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadImage = exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatus = _interopRequireDefault(require("http-status"));
var _apiError = _interopRequireDefault(require("../utils/apiError"));
var _resizeImage = _interopRequireDefault(require("../utils/resizeImage"));
var uploadImage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var fileName;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (req.file) {
            _context.next = 2;
            break;
          }
          throw new _apiError["default"]('Please provide an image', _httpStatus["default"].BAD_REQUEST);
        case 2:
          _context.next = 4;
          return (0, _resizeImage["default"])(req.file.destination, req.file.filename);
        case 4:
          fileName = _context.sent;
          return _context.abrupt("return", res.json({
            image: fileName
          }));
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function uploadImage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.uploadImage = uploadImage;
var _default = {
  uploadImage: uploadImage
};
exports["default"] = _default;