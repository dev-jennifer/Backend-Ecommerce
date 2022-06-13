const { middleware, isAuthenticated } = require('../utils/functions'),
  UserController = require('../controllers/user.controller'),
  router = require('express').Router(),
  passport = require('passport'),
  passportLocal = require('passport-local'),
  LocalStrategy = passportLocal.Strategy;

class RouterUser {
  constructor() {
    this.controlador = new UserController();
  }
  start() {
    router.post(
      '/register',
      middleware,
      passport.authenticate('local-signup', {
        successRedirect: '/api/productos',
        failureRedirect: '/register',
        failureFlash: true,
      })
    );

    router.post('/login', function (req, res, next) {
      passport.authenticate('local-signin', {
        // A error also means, an unsuccessful login attempt

        successRedirect: '/api/productos',
        failureRedirect: '/login',
        failureFlash: true,
      })(req, res, next);
    });

    router.get('/register', this.controlador.renderRegisterForm);
    router.get('/profile', isAuthenticated, this.controlador.renderProfile);
    router.get('/login', this.controlador.renderLoginForm);
    router.get('/logout', this.controlador.renderLogOut);
    return router;
  }
}
module.exports = RouterUser;
