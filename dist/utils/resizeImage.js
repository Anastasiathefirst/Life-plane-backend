"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _sharp = _interopRequireDefault(require("sharp"));
var ResizeImage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(folder, fileName) {
    var options,
      newFileName,
      _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {
            width: 300,
            height: 300
          };
          newFileName = "".concat(options.width, "x").concat(options.height, "-") + fileName;
          _context.next = 4;
          return (0, _sharp["default"])(folder + '/' + fileName).resize(options.width, options.height).toFile(folder + '/' + newFileName);
        case 4:
          return _context.abrupt("return", newFileName);
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function ResizeImage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var _default = ResizeImage;
exports["default"] = _default;