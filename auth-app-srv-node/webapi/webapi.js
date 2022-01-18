const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const settings = require('../config/settings.config');
const passport = require("passport");
const authStrategies = require('./auth-strategies');
const securedRouter = require("./routes/secured");
const session = require("express-session");

const app = express();

function setupExpress() {
  const corsOptions = {
    origin: 'http://localhost:4200'
  };

  app.use(cors(corsOptions));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(compression());
}

function setupGlobalErrorHandling() {
  //Handle errors
  app.use(function(err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }

    res.status(err.status || 500);
    if(err.message) {
      res.send({ message: err.message });
    } else {
      res.send({ message: err });
    }
  });
}

function registerRoutes() {
  const authRouter = require('./routes/auth');
  const securedRouter = require('./routes/secured');

  app.use('/auth', authRouter);

  app.use('/secured', passport.authenticate('jwtGuardAccess', { session: false }), securedRouter);
}


module.exports = function init() {
  setupExpress();

  app.use(passport.initialize());
  passport.serializeUser(function(user, done){
    return done(null, user.userId);
  });

  authStrategies();

  setupGlobalErrorHandling();

  registerRoutes();

  app.listen(settings.webApiPort, 'localhost', () => {
    console.log(`Started listening at port number ${settings.webApiPort}`);
  });
}
