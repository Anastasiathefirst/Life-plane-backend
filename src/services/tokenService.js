import moment from 'moment';
import config from '~/config/config';
import APIError from '~/utils/apiError';
import jwtService from './jwtService';
import httpStatus from 'http-status';
import crypto from 'crypto';
import User from '~/models/userModel';

export const generateRandomToken = async (length = 32) => {
  const token = crypto.randomBytes(length).toString('hex');
  console.log('➡️ generateRandomToken:', token);
  return token;
};

export const generateAuthTokens = async (user) => {
  console.log('➡️ generateAuthTokens for user:', user.id);
  const accessTokenExpires = moment().add(config.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
  const accessToken = await jwtService.sign(
    user.id,
    accessTokenExpires,
    config.JWT_ACCESS_TOKEN_SECRET_PRIVATE,
    { algorithm: 'RS256' }
  );
  console.log('➡️ Generated accessToken');

  const refreshTokenExpires = moment().add(config.REFRESH_TOKEN_EXPIRATION_DAYS, 'days');
  const refreshToken = await generateRandomToken();
  await user.saveRefreshToken(refreshToken, refreshTokenExpires.toDate());
  console.log('➡️ Saved refreshToken');

  return {
    accessToken: { token: accessToken, expires: accessTokenExpires.toDate() },
    refreshToken: { token: refreshToken, expires: refreshTokenExpires.toDate() },
  };
};

export const generateVerifyEmailToken = async (user) => {
  console.log('➡️ generateVerifyEmailToken for user:', user.id);
  const token = await generateRandomToken(32);
  console.log('➡️ verifyEmailToken:', token);

  user.emailVerificationToken = token;
  user.emailVerificationExpires = moment().add(1, 'hour').toDate();
  await user.save();
  console.log('➡️ Saved emailVerificationToken');

  return token;
};

export default {
  generateRandomToken,
  generateAuthTokens,
  generateVerifyEmailToken,
};
