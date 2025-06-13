"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _joi = _interopRequireDefault(require("joi"));
_dotenv["default"].config();
var envValidate = _joi["default"].object().keys({
  NODE_ENV: _joi["default"].string().valid('production', 'development', 'test').required(),
  APP_NAME: _joi["default"].string().allow('').empty('')["default"]('App Name'),
  HOST: _joi["default"].string().allow('').empty('')["default"]('0.0.0.0'),
  PORT: _joi["default"].number().allow('').empty('')["default"](666),
  DATABASE_URI: _joi["default"].string().required(),
  JWT_SECRET: _joi["default"].string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_MINUTES: _joi["default"].number()["default"](240),
  REFRESH_TOKEN_EXPIRATION_DAYS: _joi["default"].number()["default"](1),
  VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES: _joi["default"].number()["default"](60),
  RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES: _joi["default"].number()["default"](30),
  SMTP_HOST: _joi["default"].string(),
  SMTP_PORT: _joi["default"].number(),
  SMTP_USERNAME: _joi["default"].string(),
  SMTP_PASSWORD: _joi["default"].string(),
  EMAIL_FROM: _joi["default"].string(),
  MAILGUN_API_KEY: _joi["default"].string().required(),
  MAILGUN_DOMAIN: _joi["default"].string().required(),
  FRONTEND_URL: _joi["default"].string()["default"]('http://localhost:777'),
  IMAGE_URL: _joi["default"].string()["default"]('http://localhost:666/images')
}).unknown();
var _envValidate$prefs$va = envValidate.prefs({
    errors: {
      label: 'key'
    }
  }).validate(process.env),
  env = _envValidate$prefs$va.value,
  error = _envValidate$prefs$va.error;
if (error) {
  throw new Error("Config env error: ".concat(error.message));
}
var _default = {
  NODE_ENV: env.NODE_ENV,
  APP_NAME: env.APP_NAME,
  HOST: env.HOST,
  PORT: env.PORT,
  DATABASE_URI: env.DATABASE_URI,
  DATABASE_OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority'
  },
  JWT_SECRET: env.JWT_SECRET,
  JWT_ACCESS_TOKEN_EXPIRATION_MINUTES: env.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES,
  REFRESH_TOKEN_EXPIRATION_DAYS: env.REFRESH_TOKEN_EXPIRATION_DAYS,
  VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES: env.VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES,
  RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES: env.RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES,
  SMTP_HOST: env.SMTP_HOST,
  SMTP_PORT: env.SMTP_PORT,
  SMTP_USERNAME: env.SMTP_USERNAME,
  SMTP_PASSWORD: env.SMTP_PASSWORD,
  EMAIL_FROM: env.EMAIL_FROM,
  MAILGUN_API_KEY: env.MAILGUN_API_KEY,
  MAILGUN_DOMAIN: env.MAILGUN_DOMAIN,
  FRONTEND_URL: env.FRONTEND_URL,
  IMAGE_URL: env.IMAGE_URL,
  TOKEN_TYPES: {
    REFRESH: 'refresh',
    VERIFY_EMAIL: 'verifyEmail',
    RESET_PASSWORD: 'resetPassword'
  }
};
exports["default"] = _default;