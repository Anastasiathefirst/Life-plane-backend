import Joi from 'joi';

export const signup = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().trim().min(6).max(666).required(),
  }),
};

export const signin = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const signout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().trim().min(6).max(666).required(),
  }),
};

export const updateMe = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().trim().min(6).max(666),
    avatar: Joi.string().max(666),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export default {
  signup,
  signin,
  updateMe,
  signout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
