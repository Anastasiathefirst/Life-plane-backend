"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _joi = _interopRequireDefault(require("joi"));
var _lodash = _interopRequireDefault(require("lodash"));
var validate = function validate(schema) {
  return function (req, res, next) {
    var validSchema = _lodash["default"].pick(schema, ['params', 'query', 'body']);
    var object = _lodash["default"].pick(req, Object.keys(validSchema));
    var _Joi$compile$prefs$va = _joi["default"].compile(validSchema).prefs({
        errors: {
          label: 'path',
          wrap: {
            label: false
          }
        },
        abortEarly: false
      }).validate(object),
      error = _Joi$compile$prefs$va.error,
      value = _Joi$compile$prefs$va.value;
    if (error) {
      return next(error);
    }
    Object.assign(req, value);
    return next();
  };
};
var _default = validate;
exports["default"] = _default;