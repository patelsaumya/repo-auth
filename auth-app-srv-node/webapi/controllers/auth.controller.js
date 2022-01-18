const passport = require('passport');
const jwt = require('jsonwebtoken');
const encryptConfig = require('../../config/encrypt.config');

function loginLocal(req, res, next) {
  passport.authenticate('localLogin',  (err, user) => {
    if(!user) {
      return res.status(400).json({message: 'Invalid Login Credentials'});
    }
    const accessToken = jwt.sign({
      sub: user.loginId,
      fullName: user.fullName,
      userType: user.userType
    }, encryptConfig.accessTokenSecretKey, {algorithm: 'HS256', expiresIn: '30s'});
    const refreshToken = jwt.sign({
      sub: user.loginId,
    }, encryptConfig.refreshTokenSecretKey, {algorithm: 'HS256', expiresIn: '2m'});
    return res.json({accessToken, refreshToken});
  })(req, res, next);
}

function startGoogleAuth(req, res, next) {
  passport.authenticate('googleLogin',  {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.email'
    ]},(err, user) => {

  })(req, res, next);
}

function loginGoogle(req, res, next) {
  passport.authenticate('googleLogin',  (err, user) => {
    if(!user) {
      return res.status(400).json({message: 'Invalid Credentials'});
    } else {

      const accessToken = jwt.sign({
        sub: user.loginId,
        fullName: user.fullName,
        userType: user.userType
      }, encryptConfig.accessTokenSecretKey, {algorithm: 'HS256', expiresIn: '30s'});

      const refreshToken = jwt.sign({
        sub: user.loginId,
      }, encryptConfig.refreshTokenSecretKey, {algorithm: 'HS256', expiresIn: '2m'});

      //Learning-Point: The only way to send the data to client using redirect is in url or setting cookie.
      res.cookie('access_token', accessToken, {sameSite: 'strict'});
      res.cookie('refresh_token', refreshToken, {sameSite: 'strict'});

      return res.redirect('http://localhost:4200/core');
    }
  })(req, res, next);
}

function getNewAccessToken(req, res, next) {
  passport.authenticate('jwtGuardRefresh',  (err, user) => {
    if(!user) {
      return res.status(401).json({message: 'TokenExpired'});
    }
    const accessToken = jwt.sign({
      sub: user.loginId,
      fullName: user.fullName,
      userType: user.userType
    }, encryptConfig.accessTokenSecretKey, {algorithm: 'HS256', expiresIn: '30s'});
    const refreshToken = jwt.sign({
      sub: user.loginId,
    }, encryptConfig.refreshTokenSecretKey, {algorithm: 'HS256', expiresIn: '2m'});
    return res.json({accessToken, refreshToken});
  })(req, res, next);
}

module.exports = {
  loginLocal,
  startGoogleAuth,
  loginGoogle,
  getNewAccessToken
}
