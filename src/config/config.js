import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envValidate = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    APP_NAME: Joi.string().allow('').empty('').default('App Name'),
    HOST: Joi.string().allow('').empty('').default('0.0.0.0'),
    PORT: Joi.number().allow('').empty('').default(666),

    DATABASE_URI: Joi.string().required(),

    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_MINUTES: Joi.number().default(240),

    REFRESH_TOKEN_EXPIRATION_DAYS: Joi.number().default(1),
    VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES: Joi.number().default(60),
    RESET_PASSWORD_TOKEN_EXPIRATION_MINUTES: Joi.number().default(30),

    SMTP_HOST: Joi.string(),
    SMTP_PORT: Joi.number(),
    SMTP_USERNAME: Joi.string(),
    SMTP_PASSWORD: Joi.string(),
    EMAIL_FROM: Joi.string(),

    MAILGUN_API_KEY: Joi.string().required(),
    MAILGUN_DOMAIN: Joi.string().required(),

    FRONTEND_URL: Joi.string().default('http://localhost:777'),
    IMAGE_URL: Joi.string().default('http://localhost:666/images')
  })
  .unknown();

const { value: env, error } = envValidate.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config env error: ${error.message}`);
}

export default {
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
