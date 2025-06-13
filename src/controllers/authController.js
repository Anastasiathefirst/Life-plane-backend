import APIError from '~/utils/apiError';
import tokenService from '~/services/tokenService';
import emailService from '~/services/emailService';
import User from '~/models/userModel';
import httpStatus from 'http-status';
import Role from '~/models/roleModel';
import * as sphereController from '~/controllers/sphereController';

export const signup = async (req, res) => {
  try {
    console.log('➡️ Signup request headers:', JSON.stringify(req.headers));
    console.log('➡️ Signup raw body:', JSON.stringify(req.body));

    if (!req.is('application/json')) {
      throw new APIError('Invalid Content-Type', httpStatus.BAD_REQUEST);
    }

    const { email, password, firstName, lastName, userName } = req.body;
    
    if (!email || !password || !firstName || !lastName || !userName) {
      throw new APIError('Missing required fields', httpStatus.BAD_REQUEST);
    }

    console.log('🔍 Checking existing user for email:', email);
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      console.warn('⚠️ User already exists:', email);
      throw new APIError('Пользователь уже существует', httpStatus.CONFLICT);
    }

    console.log('🔍 Getting User role');
    const role = await Role.getRoleByName('User');
    if (!role) {
      throw new APIError('Role not found', httpStatus.INTERNAL_SERVER_ERROR);
    }

    console.log('🛠 Creating new user');
    const user = await User.createUser({
      email,
      password,
      firstName,
      lastName,
      userName,
      roles: [role.id],
      confirmed: false,
    });

    if (!user) {
      throw new APIError('Ошибка создания пользователя', httpStatus.INTERNAL_SERVER_ERROR);
    }

    console.log('🔑 Generating verification token');
    const verifyToken = await tokenService.generateVerifyEmailToken(user);
    
    console.log('🔑 Generating auth tokens');
    const tokens = await tokenService.generateAuthTokens(user);

    console.log('📨 Sending verification email');
    await emailService.sendVerificationEmail(user.email, verifyToken);
    
    console.log('🌐 Creating initial spheres');
    await sphereController.createInitialSpheres(user.id);

    console.log('✅ User registration successful');
    return res.status(httpStatus.CREATED).json({
      success: true,
      data: { 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName
        },
        tokens 
      },
    });
  } catch (err) {
    console.error('🔥 Error in signup:', err);
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    console.log('🔍 Verifying email token:', req.query.token);
    const { token } = req.query;

    if (!token) {
      throw new APIError('Token is required', httpStatus.BAD_REQUEST);
    }

    const user = await User.findOneAndUpdate(
      { 
        verifyToken: token,
        verifyTokenExpires: { $gt: Date.now() }
      },
      { 
        $set: { confirmed: true },
        $unset: { verifyToken: 1, verifyTokenExpires: 1 }
      },
      { new: true }
    );

    if (!user) {
      throw new APIError('Ссылка недействительна или истек срок действия', httpStatus.BAD_REQUEST);
    }

    console.log('✅ Email confirmed for:', user.email);
    return res.json({
      success: true,
      message: 'Email подтверждён',
    });
  } catch (err) {
    console.error('❌ Error in verifyEmail:', err);
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const signin = async (req, res) => {
  try {
    console.log('🔑 Signin request:', JSON.stringify(req.body));
    const { userName, password } = req.body;

    if (!userName || !password) {
      throw new APIError('Username and password are required', httpStatus.BAD_REQUEST);
    }

    console.log('🔍 Finding user:', userName);
    const user = await User.getUserByUserName(userName);
    if (!user) {
      throw new APIError('Неверные учетные данные', httpStatus.UNAUTHORIZED);
    }

    console.log('🔐 Checking password');
    const isPasswordMatch = await user.isPasswordMatch(password);
    if (!isPasswordMatch) {
      throw new APIError('Неверные учетные данные', httpStatus.UNAUTHORIZED);
    }

    if (!user.confirmed) {
      throw new APIError('Email не подтверждён', httpStatus.UNAUTHORIZED);
    }

    console.log('🔑 Generating auth tokens');
    const tokens = await tokenService.generateAuthTokens(user);

    console.log('✅ Login successful for:', user.userName);
    return res.json({
      success: true,
      data: { 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName
        },
        tokens 
      },
    });
  } catch (err) {
    console.error('❌ Error in signin:', err);
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const current = async (req, res) => {
  try {
    console.log('👤 Getting current user:', req.user.id);
    const user = await User.getUserByIdWithRoles(req.user.id);
    if (!user) {
      throw new APIError('User not found', httpStatus.NOT_FOUND);
    }
    return res.json({ 
      success: true, 
      data: user 
    });
  } catch (err) {
    console.error('❌ Error in current:', err);
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const refreshTokens = async (req, res) => {
  try {
    console.log('🔄 Refreshing tokens with:', req.body.refreshToken);
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new APIError('Refresh token is required', httpStatus.BAD_REQUEST);
    }

    const user = await tokenService.verifyRefreshToken(refreshToken);
    const tokens = await tokenService.generateAuthTokens(user);

    console.log('✅ Tokens refreshed for:', user.id);
    return res.json({ 
      success: true, 
      data: { tokens } 
    });
  } catch (err) {
    console.error('❌ Error in refreshTokens:', err);
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const sendVerificationEmail = async (req, res) => {
  try {
    console.log('📨 Request to send verification email for:', req.user.id);
    const user = await User.getUserById(req.user.id);
    if (!user) {
      throw new APIError('Пользователь не найден', httpStatus.NOT_FOUND);
    }

    if (user.confirmed) {
      return res.json({ 
        success: true, 
        message: 'Email уже подтверждён' 
      });
    }

    const verifyToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user.email, verifyToken);

    console.log('✅ Verification email sent to:', user.email);
    return res.json({ 
      success: true, 
      message: 'Письмо отправлено' 
    });
  } catch (err) {
    console.error('❌ Error in sendVerificationEmail:', err);
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    console.log('🔑 Forgot password request for:', req.body.email);
    const { email } = req.body;
    
    if (!email) {
      throw new APIError('Email is required', httpStatus.BAD_REQUEST);
    }

    const user = await User.getUserByEmail(email);
    if (!user) {
      throw new APIError('Пользователь не найден', httpStatus.NOT_FOUND);
    }

    const resetToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendResetPasswordEmail(user.email, resetToken);

    console.log('✅ Reset password email sent to:', email);
    return res.json({ 
      success: true, 
      message: 'Письмо для сброса пароля отправлено' 
    });
  } catch (err) {
    console.error('❌ Error in forgotPassword:', err);
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log('🔄 Resetting password with token:', req.query.token);
    const { token } = req.query;
    const { password } = req.body;
    
    if (!token || !password) {
      throw new APIError('Token and password are required', httpStatus.BAD_REQUEST);
    }

    const user = await User.findOneAndUpdate(
      { 
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() }
      },
      { 
        password,
        $unset: { resetToken: 1, resetTokenExpires: 1 }
      },
      { new: true }
    );

    if (!user) {
      throw new APIError('Недействительный или просроченный токен', httpStatus.BAD_REQUEST);
    }

    console.log('✅ Password reset for:', user.email);
    return res.json({ 
      success: true, 
      message: 'Пароль успешно обновлён' 
    });
  } catch (err) {
    console.error('❌ Error in resetPassword:', err);
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
      status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: err.message || 'Internal Server Error',
    });
  }
};

export default {
  signup,
  signin,
  current,
  refreshTokens,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword
};