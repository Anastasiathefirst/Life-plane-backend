import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import config from './config';
import User from '~/models/userModel';

// 🔍 DEBUG LOG
console.log("🔐 JWT_SECRET used in passport strategy:", config.JWT_SECRET);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT_SECRET, // 👈 HS256 секрет
      algorithms: ['HS256']
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.getUserById(jwtPayload.sub);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;
