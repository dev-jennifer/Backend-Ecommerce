const bcrypt = require('bcrypt');
const sendEmail = require('../../notificaciones/emails/Registration/newUser');
const CustomError = require('../classes/CustomError.class');
const logger = require('../utils/loggers');
const UserFactory = require('../classes/User/UserFactory.class');

class UserController {
  constructor() {
    this.userDAO = UserFactory.get();
  }
  renderRegisterForm = async (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/productos');
    }
    res.render('register', {
      title: 'Auth',
      layout: 'index',
      newUser: this.userDAO,
    });
  };

  renderLoginForm = async (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/productos');
    }
    res.render('index', { title: 'Auth' });
  };

  renderLogOut = (req, res) => {
    req.logout();
    req.session.destroy();
    // req.flash('success', 'You are logged out');
    res.redirect('/login');
  };

  renderProfile = (req, res) => {
    console.log('REQ', req.user);
    res.render('profile', { title: 'Profile' });
  };
  register = async (req, email, password, done) => {
    const user = await this.userDAO.existUser(email);

    if (user) {
      return done(
        null,
        false,
        req.flash('signupMessage', 'The Email is already Taken.')
      );
    } else {
      req.body.email = email;
      password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(5),
        null
      );

      let phoneFull = '+' + req.body.country + req.body.phone;
      let newUserRegister = {
        email: email,
        password: password,
        phone: phoneFull,
        name: req.body.name,
        lastName: req.body.lastName,
        address: req.body.address,
        age: req.body.age,
        avatar: req.file.filename,
      };

      await this.userDAO.guardar(newUserRegister);
      done(null, newUserRegister, sendEmail(newUserRegister));
    }
  };

  existPassport = async (email) => {
    const user = await this.userDAO.existUser(email);
    console.log('user', user);
    return user;
  };

  login = async (req, email, password, done) => {
    try {
      const user = await this.userDAO.mostrarId('email', email);
      if (!user) {
        return done(null, false, req.flash('signinMessage', 'No User Found'));
      }

      bcrypt.compare(password, user.password, function (err, result) {
        if (result == true) {
          console.log('USEROK', user);
          return done(null, user);
        } else {
          console.log('false');
          return done(
            null,
            false,
            req.flash('signinMessage', 'Incorrect Password')
          );
        }
      });
    } catch (err) {
      const error = new CustomError(500, 'Error al mostrarId()', err);
      logger.error(error);
    }
  };
}

module.exports = UserController;
