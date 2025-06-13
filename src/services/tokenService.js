import moment from 'moment';
import config from '~/config/config';
import APIError from '~/utils/apiError';
import jwtService from './jwtService';
import httpStatus from 'http-status';
import crypto from 'crypto';
import User from '~/models/userModel';
import Token from '~/models/tokenModel';

export const generateRandomToken = async (length = 32) => {
  const token = crypto.randomBytes(length).toString('hex');
  console.log('➡️ generateRandomToken:', token);
  return token;
};

export const generateAuthTokens = async (user) => {
  console.log('➡️ generateAuthTokens for user:', user.id);
  
  try {
    const accessTokenExpires = moment().add(config.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
    const accessToken = await jwtService.sign(
      user.id,
      accessTokenExpires,
      config.JWT_ACCESS_TOKEN_SECRET_PRIVATE
    );
    console.log('➡️ Generated accessToken');

    const refreshTokenExpires = moment().add(config.REFRESH_TOKEN_EXPIRATION_DAYS, 'days');
    const refreshToken = await generateRandomToken();
    
    await Token.saveToken(
      refreshToken,
      user.id,
      refreshTokenExpires.toDate(),
      'refresh'
    );
    console.log('➡️ Saved refreshToken');

    return {
      accessToken: { token: accessToken, expires: accessTokenExpires.toDate() },
      refreshToken: { token: refreshToken, expires: refreshTokenExpires.toDate() },
    };
  } catch (error) {
    console.error('❌ Error in generateAuthTokens:', error);
    throw error;
  }
};

export const generateVerifyEmailToken = async (user) => {
  console.log('➡️ generateVerifyEmailToken for user:', user.id);
  
  try {
    const token = await generateRandomToken(32);
    console.log('➡️ verifyEmailToken:', token);

    await Token.saveToken(
      token,
      user.id,
      moment().add(config.VERIFY_EMAIL_TOKEN_EXPIRATION_MINUTES, 'minutes').toDate(),
      'verifyEmail'
    );
    console.log('➡️ Saved emailVerificationToken');

    return token;
  } catch (error) {
    console.error('❌ Error in generateVerifyEmailToken:', error);
    throw error;
  }
};

export default {
  generateRandomToken,
  generateAuthTokens,
  generateVerifyEmailToken,
};