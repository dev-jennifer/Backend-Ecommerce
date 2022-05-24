const express = require('express'),
  passport = require('passport'),
  passportLocal = require('passport-local'),
  { middleware, isAuthenticated } = require('../utils/functions');

  
const LocalStrategy = passportLocal.Strategy;

const UserController = require('../controllers/user.controller');
const routerUser = express.Router();

passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(async (id, done) => {
  const user = UserController.existUser;
  done(null, user);
});

passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    UserController.register
  )
);

passport.use(
  'local-signin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    UserController.login
  )
);

routerUser.post(
  '/register',
  middleware,
  passport.authenticate('local-signup', {
    successRedirect: '/api/productos',
    failureRedirect: '/register',
  })
);

routerUser.post('/login', function (req, res, next) {
  passport.authenticate('local-signin', {
    successRedirect: '/api/productos',
    failureRedirect: '/login',
  })(req, res, next);
});


routerUser.get('/register', UserController.renderRegisterForm);
routerUser.get('/profile', isAuthenticated, UserController.renderProfile);
routerUser.get('/login', UserController.renderLoginForm);
routerUser.get('/logout', UserController.renderLogOut);


module.exports =  routerUser;
