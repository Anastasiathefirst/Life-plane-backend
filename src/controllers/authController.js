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
  try {
    console.log('➡️ Signup request body:', req.body);

    const { email, password, firstName, lastName, userName } = req.body;
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      console.warn('⚠️ Пользователь уже существует:', email);
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
      confirmed: false
    });

    const verifyToken = await tokenService.generateVerifyEmailToken();
    user.verifyToken = verifyToken;
    user.verifyTokenExpires = Date.now() + 1000 * 60 * 60;
    await user.save();

    await emailService.sendVerificationEmail(user.email, verifyToken);
    await sphereController.createInitialSpheres(user.id);

    const tokens = await tokenService.generateAuthTokens(user);
    console.log('✅ Пользователь создан и токены сгенерированы:', {
      userId: user.id,
      tokens
    });

    return res.json({
      success: true,
      data: { user, tokens }
    });
  } catch (err) {
    console.error('🔥 Ошибка в signup:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error'
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    console.log('🔍 Verifying email with token:', req.query.token);
    const { token } = req.query;
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new APIError('Ссылка недействительна или истек срок действия', httpStatus.BAD_REQUEST);
    }

    user.confirmed = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    console.log('✅ Email подтверждён для:', user.email);

    return res.json({
      success: true,
      message: 'Email подтверждён'
    });
  } catch (err) {
    console.error('❌ Ошибка при подтверждении email:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error'
    });
  }
};

export const signin = async (req, res) => {
  try {
    console.log('🔑 Вход с данными:', req.body);
    const { userName, password } = req.body;

    const user = await User.getUserByUserName(userName);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new APIError('Неверные учетные данные', httpStatus.UNAUTHORIZED);
    }

    if (!user.confirmed) {
      throw new APIError('Email не подтверждён', httpStatus.UNAUTHORIZED);
    }

    const tokens = await tokenService.generateAuthTokens(user);

    return res.json({
      success: true,
      data: { user, tokens }
    });
  } catch (err) {
    console.error('❌ Ошибка входа:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error'
    });
  }
};

export const current = async (req, res) => {
  const user = await User.getUserByIdWithRoles(req.user.id);
  return res.json({ success: true, data: user });
};

export const getMe = async (req, res) => {
  const user = await User.getUserById(req.user.id);
  return res.json({ success: true, data: user });
};

export const updateMe = async (req, res) => {
  const updated = await User.updateUserById(req.user.id, req.body);
  return res.json({ success: true, data: updated });
};

export const signout = async (req, res) => {
  return res.json({ success: true, message: 'Выход выполнен' });
};

export const refreshTokens = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await tokenService.verifyRefreshToken(refreshToken);
    const tokens = await tokenService.generateAuthTokens(user);
    return res.json({ success: true, data: { user, tokens } });
  } catch (err) {
    console.error('🔁 Ошибка обновления токенов:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error'
    });
  }
};

export const sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.getUserById(req.user.id);
    if (!user) {
      throw new APIError('Пользователь не найден', httpStatus.NOT_FOUND);
    }

    const verifyToken = await tokenService.generateVerifyEmailToken();
    user.verifyToken = verifyToken;
    user.verifyTokenExpires = Date.now() + 1000 * 60 * 60;
    await user.save();

    await emailService.sendVerificationEmail(user.email, verifyToken);

    console.log('📨 Verification email sent to:', user.email);

    return res.json({ success: true, message: 'Письмо отправлено' });
  } catch (err) {
    console.error('📩 Ошибка при отправке email:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error'
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.getUserByEmail(req.body.email);
    if (!user) {
      throw new APIError('Пользователь не найден', httpStatus.NOT_FOUND);
    }

    const resetToken = await tokenService.generateVerifyEmailToken();
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 1000 * 60 * 60;
    await user.save();

    await emailService.sendResetPasswordEmail(user.email, resetToken);

    console.log('🔁 Reset password email sent to:', user.email);

    return res.json({ success: true, message: 'Письмо для сброса пароля отправлено' });
  } catch (err) {
    console.error('🔁 Ошибка сброса пароля:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error'
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { password } = req.body;
    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });
    if (!user) {
      throw new APIError('Недействительный или просроченный токен', httpStatus.BAD_REQUEST);
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return res.json({ success: true, message: 'Пароль успешно обновлён' });
  } catch (err) {
    console.error('❌ Ошибка при сбросе пароля:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error'
    });
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
