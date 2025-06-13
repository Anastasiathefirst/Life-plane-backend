import APIError from '~/utils/apiError';
import tokenService from '~/services/tokenService';
import emailService from '~/services/emailService';
import User from '~/models/userModel';
import httpStatus from 'http-status';
import Role from '~/models/roleModel';
import * as sphereController from '~/controllers/sphereController';

export const signup = async (req, res) => {
  try {
    console.log('➡️ Signup request body:', req.body);

    const { email, password, firstName, lastName, userName } = req.body;
    const existingUser = await User.getUserByEmail(email);
    console.log('➡️ existingUser:', existingUser);
    if (existingUser) {
      console.warn('⚠️ Пользователь уже существует:', email);
      throw new APIError('Пользователь уже существует', httpStatus.CONFLICT);
    }

    const role = await Role.getRoleByName('User');
    console.log('➡️ role:', role);

    const user = await User.createUser({
      email,
      password,
      firstName,
      lastName,
      userName,
      roles: [role.id],
      confirmed: false,
    });
    console.log('➡️ Created user:', user);
    if (!user) {
      throw new APIError('Ошибка создания пользователя', httpStatus.INTERNAL_SERVER_ERROR);
    }

    const verifyToken = await tokenService.generateVerifyEmailToken(user);
    console.log('➡️ Generated verifyToken:', verifyToken);

    user.verifyToken = verifyToken;
    user.verifyTokenExpires = Date.now() + 3600_000;
    await user.save();
    console.log('➡️ user saved with verifyToken');

    await emailService.sendVerificationEmail(user.email, verifyToken);
    console.log('➡️ Verification email sent to:', user.email);

    await sphereController.createInitialSpheres(user.id);
    console.log('➡️ Initial spheres created for user');

    const tokens = await tokenService.generateAuthTokens(user);
    console.log('✅ Tokens generated:', tokens);

    return res.json({
      success: true,
      data: { user, tokens },
    });
  } catch (err) {
    console.error('🔥 Error in signup:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    console.log('🔍 Verifying email token:', req.query.token);
    const { token } = req.query;
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpires: { $gt: Date.now() },
    });
    console.log('➡️ Found user for verifyEmail:', user);

    if (!user) {
      throw new APIError('Ссылка недействительна или истек срок действия', httpStatus.BAD_REQUEST);
    }

    user.confirmed = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();
    console.log('✅ Email confirmed for:', user.email);

    return res.json({
      success: true,
      message: 'Email подтверждён',
    });
  } catch (err) {
    console.error('❌ Error in verifyEmail:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const signin = async (req, res) => {
  try {
    console.log('🔑 Signin body:', req.body);
    const { userName, password } = req.body;
    const user = await User.getUserByUserName(userName);
    console.log('➡️ Found user for signin:', user);

    if (!user || !(await user.isPasswordMatch(password))) {
      throw new APIError('Неверные учетные данные', httpStatus.UNAUTHORIZED);
    }
    if (!user.confirmed) {
      throw new APIError('Email не подтверждён', httpStatus.UNAUTHORIZED);
    }

    const tokens = await tokenService.generateAuthTokens(user);
    console.log('✅ Signin tokens:', tokens);

    return res.json({
      success: true,
      data: { user, tokens },
    });
  } catch (err) {
    console.error('❌ Error in signin:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const current = async (req, res) => {
  try {
    console.log('👤 Getting current user:', req.user.id);
    const user = await User.getUserByIdWithRoles(req.user.id);
    return res.json({ success: true, data: user });
  } catch (err) {
    console.error('❌ Error in current:', err);
    res.status(500).json({ status: 500, errors: 'Internal Server Error' });
  }
};

export const getMe = async (req, res) => {
  try {
    console.log('👤 Getting getMe user:', req.user.id);
    const user = await User.getUserById(req.user.id);
    return res.json({ success: true, data: user });
  } catch (err) {
    console.error('❌ Error in getMe:', err);
    res.status(500).json({ status: 500, errors: 'Internal Server Error' });
  }
};

export const updateMe = async (req, res) => {
  try {
    console.log('🛠 Updating user:', req.user.id);
    const updated = await User.updateUserById(req.user.id, req.body);
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('❌ Error in updateMe:', err);
    res.status(500).json({ status: 500, errors: 'Internal Server Error' });
  }
};

export const signout = async (req, res) => {
  console.log('🚪 User signout:', req.user?.id);
  return res.json({ success: true, message: 'Выход выполнен' });
};

export const refreshTokens = async (req, res) => {
  try {
    console.log('🔁 Refreshing tokens:', req.body.refreshToken);
    const user = await tokenService.verifyRefreshToken(req.body.refreshToken);
    const tokens = await tokenService.generateAuthTokens(user);
    console.log('✅ Tokens refreshed:', tokens);
    return res.json({ success: true, data: { user, tokens } });
  } catch (err) {
    console.error('❌ Error in refreshTokens:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const sendVerificationEmail = async (req, res) => {
  try {
    console.log('📨 sendVerificationEmail for user:', req.user.id);
    const user = await User.getUserById(req.user.id);
    if (!user) {
      throw new APIError('Пользователь не найден', httpStatus.NOT_FOUND);
    }

    const verifyToken = await tokenService.generateVerifyEmailToken(user);
    console.log('➡️ New verifyToken:', verifyToken);

    await emailService.sendVerificationEmail(user.email, verifyToken);
    console.log('📨 Verification email sent to:', user.email);

    return res.json({ success: true, message: 'Письмо отправлено' });
  } catch (err) {
    console.error('📩 Error in sendVerificationEmail:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    console.log('🔑 forgotPassword email:', req.body.email);
    const user = await User.getUserByEmail(req.body.email);
    if (!user) {
      throw new APIError('Пользователь не найден', httpStatus.NOT_FOUND);
    }

    const resetToken = await tokenService.generateVerifyEmailToken(user);
    console.log('➡️ resetToken:', resetToken);

    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600_000;
    await user.save();
    console.log('➡️ User updated with resetToken');

    await emailService.sendResetPasswordEmail(user.email, resetToken);
    console.log('🔁 Reset password email sent to:', user.email);

    return res.json({ success: true, message: 'Письмо для сброса пароля отправлено' });
  } catch (err) {
    console.error('🔁 Error in forgotPassword:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log('🔄 resetPassword token:', req.query.token);
    const { token } = req.query;
    const { password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });
    console.log('➡️ Found user for resetPassword:', user);

    if (!user) {
      throw new APIError('Недействительный или просроченный токен', httpStatus.BAD_REQUEST);
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    console.log('✅ Password reset successful for:', user.email);

    return res.json({ success: true, message: 'Пароль успешно обновлён' });
  } catch (err) {
    console.error('❌ Error in resetPassword:', err);
    res.status(err.status || 500).json({
      status: err.status || 500,
      errors: err.message || 'Internal Server Error',
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
  resetPassword,
};
