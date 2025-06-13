"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var paginate = function paginate(schema) {
  schema.statics.paginate = /*#__PURE__*/function () {
    var _paginateFunc = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(options, populate, query) {
      var sortBy, sortDirection, page, limit, skip, countPromise, docsPromise, _yield$Promise$all, _yield$Promise$all2, totalResults, results;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            sortBy = options.sortBy ? options.sortBy : 'createdAt';
            sortDirection = options.sortDirection && options.sortDirection === 'asc' ? 'asc' : 'desc';
            page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
            limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
            skip = (page - 1) * limit;
            countPromise = this.countDocuments(query).exec();
            docsPromise = this.find(query).sort((0, _defineProperty2["default"])({}, sortBy, sortDirection)).skip(skip).limit(limit);
            if (populate) {
              populate.split(' ').forEach(function (populate) {
                docsPromise = docsPromise.populate(populate.split('.').reverse().reduce(function (a, b) {
                  return {
                    path: b,
                    populate: a
                  };
                }));
              });
            }
            docsPromise = docsPromise.exec();
            _context.next = 11;
            return Promise.all([countPromise, docsPromise]);
          case 11:
            _yield$Promise$all = _context.sent;
            _yield$Promise$all2 = (0, _slicedToArray2["default"])(_yield$Promise$all, 2);
            totalResults = _yield$Promise$all2[0];
            results = _yield$Promise$all2[1];
            return _context.abrupt("return", {
              results: results,
              totalResults: totalResults
            });
          case 16:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function paginateFunc(_x, _x2, _x3) {
      return _paginateFunc.apply(this, arguments);
    }
    return paginateFunc;
  }();
};
var _default = paginate;
exports["default"] = _default;