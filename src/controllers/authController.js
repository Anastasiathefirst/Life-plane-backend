import APIError from '~/utils/apiError';
import tokenService from '~/services/tokenService';
import emailService from '~/services/emailService';
import User from '~/models/userModel';
import config from '~/config/config';
import httpStatus from 'http-status';
import Role from '~/models/roleModel';
import jwt from 'jsonwebtoken';
import * as sphereController from '~/controllers/sphereController';

export const signup = async (req, res) => {
  const { email, password, firstName, lastName, userName } = req.body;

  const existingUser = await User.getUserByEmail(email);
  if (existingUser) {
    throw new APIError('Пользователь уже существует', httpStatus.CONFLICT);
  }

  const role = await Role.getRoleByName('User');
  const user = await User.createUser({
    email,
    password,
    firstName,
    lastName,
    userName,
    roles: [role.id],
    confirmed: true
  });

  await sphereController.createInitialSpheres(user.id);

  const tokens = await tokenService.generateAuthTokens(user);

  return res.json({
    success: true,
    data: { user, tokens }
  });
};

export const verifyEmail = async (req, res) => {
  throw new APIError('Подтверждение email временно отключено', httpStatus.NOT_IMPLEMENTED);
};

export const signin = async (req, res) => {
  const user = await User.getUserByUserName(req.body.userName);
  if (!user || !(await user.isPasswordMatch(req.body.password))) {
    throw new APIError('Incorrect user name or password', httpStatus.BAD_REQUEST);
  }
  if (!user.confirmed) {
    throw new APIError('Please verify your email before logging in.', httpStatus.UNAUTHORIZED);
  }
  const tokens = await tokenService.generateAuthTokens(user);
  return res.json({
    success: true,
    data: { user, tokens }
  });
};

export const current = async (req, res) => {
  const user = await User.getUserById(req.user.id);
  if (!user) {
    throw new APIError('User not found', httpStatus.NOT_FOUND);
  }
  return res.json({
    success: true,
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      avatarUrl: user.avatarUrl
    }
  });
};

export const getMe = async (req, res) => {
  const user = await User.getUserByIdWithRoles(req.user.id);
  if (!user) {
    throw new APIError('User not found', httpStatus.NOT_FOUND);
  }
  return res.json({
    success: true,
    data: user
  });
};

export const updateMe = async (req, res) => {
  const user = await User.updateUserById(req.user.id, req.body);
  return res.json({
    success: true,
    data: user
  });
};

export const signout = async (req, res) => {
  return res.json({
    success: true,
    data: 'Signout success'
  });
};

export const refreshTokens = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refreshToken, config.JWT_ACCESS_TOKEN_SECRET_PUBLIC, {
      algorithms: ['RS256']
    });
    const user = await User.getUserById(decoded.sub);
    if (!user) {
      throw new Error('User not found');
    }
    const tokens = await tokenService.generateAuthTokens(user);
    return res.json({
      success: true,
      data: { tokens }
    });
  } catch (err) {
    throw new APIError('Invalid refresh token', httpStatus.UNAUTHORIZED);
  }
};

export const sendVerificationEmail = async (req, res) => {
  throw new APIError('Email verification временно отключено', httpStatus.NOT_IMPLEMENTED);
};

export const forgotPassword = async (req, res) => {
  throw new APIError('Password recovery временно отключено', httpStatus.NOT_IMPLEMENTED);
};

export const resetPassword = async (req, res) => {
  throw new APIError('Password reset временно отключено', httpStatus.NOT_IMPLEMENTED);
};

export default {
  signup,
  signin,
  current,
  getMe,
  updateMe,
  signout,
  refreshTokens,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword
};
