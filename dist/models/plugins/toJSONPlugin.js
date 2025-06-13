"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
function normalizeId(ret) {
  if (ret._id && (0, _typeof2["default"])(ret._id) === 'object' && ret._id.toString) {
    if (typeof ret.id === 'undefined') {
      ret.id = ret._id.toString();
    }
  }
  if (typeof ret._id !== 'undefined') {
    delete ret._id;
  }
}
function removePrivatePaths(ret, schema) {
  for (var path in schema.paths) {
    if (schema.paths[path].options && schema.paths[path].options["private"]) {
      if (typeof ret[path] !== 'undefined') {
        delete ret[path];
      }
    }
  }
}
function removeVersion(ret) {
  if (typeof ret.__v !== 'undefined') {
    delete ret.__v;
  }
}
function toJSON(schema) {
  // NOTE: this plugin is actually called *after* any schema's
  // custom toJSON has been defined, so we need to ensure not to
  // overwrite it. Hence, we remember it here and call it later
  var _transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    _transform = schema.options.toJSON.transform;
  }

  // Extend toJSON options
  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform: function transform(doc, ret, options) {
      // Remove private paths
      if (schema.options.removePrivatePaths !== false) {
        removePrivatePaths(ret, schema);
      }

      // Remove version
      if (schema.options.removeVersion !== false) {
        removeVersion(ret);
      }

      // Normalize ID
      if (schema.options.normalizeId !== false) {
        normalizeId(ret);
      }

      // Call custom transform if present
      if (_transform) {
        return _transform(doc, ret, options);
      }
      return ret;
    }
  });
}
var _default = toJSON;
exports["default"] = _default;