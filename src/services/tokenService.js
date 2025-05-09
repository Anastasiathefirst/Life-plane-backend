import moment from 'moment';
import config from '~/config/config';
import APIError from '~/utils/apiError';
import User from '~/models/userModel';
import jwtService from './jwtService';
import httpStatus from 'http-status';
import crypto from 'crypto';

export const generateRandomToken = async (length = 66) => {
  return crypto.randomBytes(length).toString('hex');
};

export const verifyToken = async (token, expectedToken) => {
  if (token !== expectedToken) {
    throw new APIError('Invalid or expired token', httpStatus.UNAUTHORIZED);
  }
  return true;
};

export const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
  const accessToken = await jwtService.sign(user.id, accessTokenExpires, config.JWT_ACCESS_TOKEN_SECRET_PRIVATE, {
    algorithm: 'RS256',
  });

  const refreshTokenExpires = moment().add(config.REFRESH_TOKEN_EXPIRATION_DAYS, 'days');
  const refreshToken = await generateRandomToken();

  // Example: attach refresh token to user manually if needed
  await user.saveRefreshToken(refreshToken, refreshTokenExpires.toDate());

  return {
    accessToken: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refreshToken: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

export const generateVerifyEmailToken = async () => {
  const token = await generateRandomToken();
  return token;
};

export default {
  generateRandomToken,
  verifyToken,
  generateAuthTokens,
  generateVerifyEmailToken
};
