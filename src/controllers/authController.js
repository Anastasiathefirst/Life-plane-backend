import APIError from '~/utils/apiError';
import tokenService from '~/services/tokenService';
import emailService from '~/services/emailService';
import User from '~/models/userModel';
import PendingUser from '~/models/pendingUser.model';
import config from '~/config/config';
import httpStatus from 'http-status';
import Role from '~/models/roleModel';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { email, password, firstName, lastName, userName } = req.body;

  const existingPending = await PendingUser.findOne({ email });
  const existingUser = await User.getUserByEmail(email);
  if (existingUser || existingPending) {
    throw new APIError('Пользователь уже существует или ожидает подтверждения', httpStatus.CONFLICT);
  }

  const role = await Role.getRoleByName('User');
  const verifyToken = await tokenService.generateVerifyEmailToken({ email });

  await PendingUser.create({
    email,
    password,
    firstName,
    lastName,
    userName,
    roles: [role.id]
  });

  await emailService.sendVerificationEmail(email, verifyToken);

  return res.json({
    success: true,
    message: 'Письмо отправлено. Подтвердите email.'
  });
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET_PUBLIC, { algorithms: ['RS256'] });
    const email = decoded.sub;

    const pending = await PendingUser.findOne({ email });
    if (!pending) {
      throw new APIError('Регистрация не найдена или устарела', httpStatus.NOT_FOUND);
    }

    const user = await User.createUser({
      email: pending.email,
      password: pending.password,
      firstName: pending.firstName,
      lastName: pending.lastName,
      userName: pending.userName,
      roles: pending.roles,
      confirmed: true
    });

    await PendingUser.deleteOne({ email });

    const tokens = await tokenService.generateAuthTokens(user);

    return res.json({
      success: true,
      data: { user, tokens }
    });
  } catch (err) {
    throw new APIError('Подтверждение email не удалось', httpStatus.UNAUTHORIZED);
  }
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
  // Ничего не делаем — stateless logout
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
  const user = await User.getUserByEmail(req.user.email);
  if (user.confirmed) {
    throw new APIError('Email already verified', httpStatus.BAD_REQUEST);
  }
  const verifyToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(req.user.email, verifyToken);
  return res.json({
    success: true,
    data: 'Verification email sent'
  });
};

export const forgotPassword = async (req, res) => {
  const resetToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetToken);
  return res.json({
    success: true,
    data: 'Password reset email sent'
  });
};

export const resetPassword = async (req, res) => {
  try {
    const decoded = jwt.verify(req.query.token, config.JWT_ACCESS_TOKEN_SECRET_PUBLIC, {
      algorithms: ['RS256']
    });
    const user = await User.getUserById(decoded.sub);
    if (!user) {
      throw new Error('User not found');
    }
    await User.updateUserById(user.id, { password: req.body.password });
    return res.json({
      success: true,
      data: 'Password has been reset'
    });
  } catch (err) {
    throw new APIError('Password reset failed', httpStatus.UNAUTHORIZED);
  }
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
