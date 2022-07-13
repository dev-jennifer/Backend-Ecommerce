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
      '/signup',
      middleware,
      passport.authenticate('local-signup', {
        successRedirect: '/productos',
        failureRedirect: '/',
        failureFlash: true,
      })
    );

    router.post('/signin', function (req, res, next) {
      passport.authenticate('local-signin', {
        successRedirect: '/productos',
        failureRedirect: '/',
        failureFlash: true,
      })(req, res, next);
    });
    router.get(
      '/auth/facebook',
      passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
    );
  
    router.get(
      '/auth/facebook/callback',
      passport.authenticate('facebook', {
        failureRedirect: '/',
        successRedirect: '/productos',
        authType: 'reauthenticate',
      })
    );



    router.get(
      '/auth/google',
      passport.authenticate('google', { scope: ['email', 'profile'] })
    );

    router.get(
      '/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/productos',
        failureRedirect: '/',
      })
    );

    router.get('/', isAuthenticated, this.controlador.renderAuth);
    router.get('/profile', isAuthenticated, this.controlador.renderProfile);
    router.get('/logout', this.controlador.renderLogOut);
    router.put('/profile/:id', this.controlador.editProfile);

    return router;
  }
}
module.exports = RouterUser;
