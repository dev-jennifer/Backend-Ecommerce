const { middleware } = require('../utils/functions'),
  UserController = require('../controllers/user.controller'),
  router = require('express').Router(),
  passport = require('passport'),
  config = require('../utils/config.js'),
  jwt = require('jsonwebtoken');
require('../passport/local-auth');

class RouterUser {
  constructor() {
    this.controlador = new UserController();
  }

  start() {
    // Function for generating jwt tokens
    const generateJwtToken = (user) => {
      const token = jwt.sign(user, config.JWT.SECRET, {
        expiresIn: '1d',
      });
      return token;
    };

    router.post(
      '/signup',
      middleware,
      passport.authenticate('local-signup', {
        failureFlash: true,
      }),
      (req, res) => {
        const token = generateJwtToken(req.user);
        res.cookie('jwt', token);
        res.redirect('/productos');
      }
    );

    router.post(
      '/signin',
      passport.authenticate('local-signin', {
        failureFlash: true,
      }),
      (req, res) => {
        const token = generateJwtToken(req.user.toJSON());
        res.cookie('jwt', token);
        res.redirect('/productos');
      }
    );

    router.get(
      '/auth/facebook',
      passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
    );

    router.get(
      '/auth/facebook/callback',
      passport.authenticate('facebook', {
        failureMessage: true,
      }),
      function (req, res) {
        const token = generateJwtToken(req.user);
        res.cookie('jwt', token);
        res.redirect('/productos');
      }
    );

    router.get(
      '/auth/google',
      passport.authenticate('google', { scope: ['email', 'profile'] })
    );

    router.get(
      '/auth/google/callback',
      passport.authenticate('google', {
        failureMessage: true,
      }),
      function (req, res) {
        const token = generateJwtToken(req.user);
        res.cookie('jwt', token);
        res.redirect('/productos');
      }
    );

    router.get(
      '/',
      passport.authenticate('jwt', {
        session: false,
        successRedirect: '/productos',
      }),
      (req, res) => {
        res.render('index', { user: req.user });
      }
    );

    router.get(
      '/profile',
      passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/',
      }),
      this.controlador.renderProfile
    );

    router.get('/logout', this.controlador.renderLogOut);
    router.put(
      '/profile/:id',
      passport.authenticate('jwt', { session: false }),
      this.controlador.editProfile
    );

    return router;
  }
}
module.exports = RouterUser;
