const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../db/db');
const encrypt = require('../config/encrypt.config');
const oauth = require('../config/oauth.config.xjs');
const types = require("../types/types");
const uuid = require('uuid');
const session = require('express-session');

module.exports = function init() {
  passport.use('localLogin', new LocalStrategy({
    usernameField: 'loginId',
    passReqToCallback: true
  }, async (req, userName, password, done) => {
    const userSensitiveInfo = await db.models.AppUserSensitiveInfo.findOne({
      where: {
        loginId: userName + '_l'
      }
    });

    if(!userSensitiveInfo) {
      return done(null, null);
    }

    const valid = await userSensitiveInfo.isValidPassword(password);
    if(!valid) {
      return done(null, null);
    }

    const user = await db.models.AppUser.findOne({
      where: {
        userId: userSensitiveInfo.userId
      }
    });

    return done(null, {loginId: userSensitiveInfo.loginId, fullName: user.fullName, userType: user.userType});
  }));

  passport.use('googleLogin', new GoogleStrategy({
      clientID: oauth.google.client_id,
      clientSecret: oauth.google.client_secret,
      callbackURL: "http://localhost:9092/auth/google-login"
    },
    async function(accessToken, refreshToken, profile, done) {
      let userSensitiveInfo = await db.models.AppUserSensitiveInfo.findOne({
        where: {
          loginId: profile.id + '_g',
        }
      });
      if(userSensitiveInfo) {
        const user = await db.models.AppUser.findOne({
          where: {
            userId: userSensitiveInfo.userId
          }
        });

        return done(null, {
          loginId: userSensitiveInfo.loginId,
          fullName: user.fullName,
          userType: user.userType
        });
      }

      const t = await db.sequelize.transaction();
      try {
        const user = await db.models.AppUser.create({
          userId: uuid.v4(),
          fullName: profile.displayName,
          userType: types.EnumUserTypes.Customer
        }, { transaction: t });

        const userSensitiveInfo = await db.models.AppUserSensitiveInfo.create({
          userId: user.userId,
          loginId: profile.id + '_g',
          mobileNumber: uuid.v4(),
          authType: 'g'
        }, { transaction: t });

        await t.commit();

        return done(null, {
          loginId: userSensitiveInfo.loginId,
          fullName: user.fullName,
          userType: user.userType
        });
      } catch (e) {
        await t.rollback();
        throw e;
      }
    }
  ));

  const optsAccessToken = {};
  optsAccessToken.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  optsAccessToken.secretOrKey = encrypt.accessTokenSecretKey;
  passport.use('jwtGuardAccess', new JwtStrategy(optsAccessToken, async function (jwtPayload, done) {
    const userSensitiveInfo = await db.models.AppUserSensitiveInfo.findOne({
      where: {
        loginId: jwtPayload.sub
      }
    });
    if(!userSensitiveInfo) {
      return done(null, null);
    }

    const user = await db.models.AppUser.findOne({
      where: {
        userId: userSensitiveInfo.userId
      }
    });

    return done(null, {userId: user.userId, loginId: userSensitiveInfo.loginId, userType: user.userType});

  }));

  const optsRefreshToken = {};
  optsRefreshToken.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  optsRefreshToken.secretOrKey = encrypt.refreshTokenSecretKey;
  passport.use('jwtGuardRefresh', new JwtStrategy(optsRefreshToken, async function (jwtPayload, done) {
    const userSensitiveInfo = await db.models.AppUserSensitiveInfo.findOne({
      where: {
        loginId: jwtPayload.sub
      }
    });
    if(!userSensitiveInfo) {
      return done(null, null);
    }

    const user = await db.models.AppUser.findOne({
      where: {
        userId: userSensitiveInfo.userId
      }
    });

    return done(null, {loginId: userSensitiveInfo.loginId, fullName: user.fullName, userType: user.userType});
  }));
}
