import moment from 'moment';
import config from '~/config/config';
import jwtService from './jwtService';
import crypto from 'crypto';
import Token from '~/models/tokenModel';

export const generateRandomToken = async (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES, 'minutes');
  const accessToken = await jwtService.sign(
    user.id,
    accessTokenExpires,
    config.JWT_ACCESS_TOKEN_SECRET_PRIVATE
  );

  const refreshTokenExpires = moment().add(config.REFRESH_TOKEN_EXPIRATION_DAYS, 'days');
  const refreshToken = await generateRandomToken();

  await Token.saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires.toDate(),
    'refresh'
  );

  return {
    accessToken: { token: accessToken, expires: accessTokenExpires.toDate() },
    refreshToken: { token: refreshToken, expires: refreshTokenExpires.toDate() },
  };
};

export default {
  generateRandomToken,
  generateAuthTokens,
};
