import jwt from 'jsonwebtoken';
import config from '~/config/config';
import APIError from '~/utils/apiError';
import httpStatus from 'http-status';

const privateKey = config.JWT_ACCESS_TOKEN_SECRET_PRIVATE.replace(/\\n/g, '\n');
const publicKey = config.JWT_ACCESS_TOKEN_SECRET_PUBLIC.replace(/\\n/g, '\n');

export const sign = (userId, expires, secret, options = {}) => {
  try {
    console.log('➡️ Signing JWT for user:', userId);
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: expires.unix()
    };
    
    return jwt.sign(payload, secret, { 
      algorithm: 'RS256',
      ...options 
    });
  } catch (error) {
    console.error('❌ JWT signing error:', error);
    throw new APIError('Token generation failed', httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const verify = (token, secret) => {
  try {
    console.log('➡️ Verifying JWT token');
    return jwt.verify(token, secret, { algorithms: ['RS256'] });
  } catch (error) {
    console.error('❌ JWT verification error:', error);
    throw new APIError('Invalid token', httpStatus.UNAUTHORIZED);
  }
};

export default {
  sign,
  verify
};