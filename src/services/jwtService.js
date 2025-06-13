import jwt from 'jsonwebtoken';
import config from '~/config/config';
import APIError from '~/utils/apiError';
import httpStatus from 'http-status';

export const sign = (userId, expires, secret = config.JWT_SECRET, options = {}) => {
  try {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expires.valueOf() / 1000)
    };

    return jwt.sign(payload, secret, {
      algorithm: 'HS256',
      ...options
    });
  } catch (error) {
    console.error('❌ JWT signing error:', error);
    throw new APIError('Token generation failed', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const verify = (token, secret = config.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret, { algorithms: ['HS256'] });
  } catch (error) {
    console.error('❌ JWT verification error:', error);
    throw new APIError('Invalid token', httpStatus.UNAUTHORIZED);
  }
};

export default {
  sign,
  verify
};
