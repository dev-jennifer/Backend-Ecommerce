const bcrypt = require('bcrypt');
const sendEmail = require('../notificaciones/emails/Registration/newUser');
const CustomError = require('../classes/CustomError.class');
const logger = require('../utils/loggers');
const UserFactory = require('../classes/User/UserFactory.class'),
  jwt = require('jsonwebtoken'); 

class UserController {
  constructor() {
    this.userDAO = UserFactory.get();
  }
  renderAuth = (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/productos');
    }
  };

  renderProfile = (req, res) => {
    console.log(req.user.toJSON());
    res.render('profile', { user: req.user.toJSON() });
  };

  renderLogOut = (req, res, next) => {
    try {
      req.session.destroy((err) => {
        res.redirect('/');
        if (err) next(err);
      });
    } catch (error) {
      logger.error('Error al cerrar sesion', error);
    }
  };

  register = async (req, email, password, done) => {
    const user = await this.userDAO.mostrarId('email', email);

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
        membershipID: 2,
      };

      await this.userDAO.guardar(newUserRegister);
      done(null, newUserRegister, sendEmail(newUserRegister));
    }
  };

  existPassport = async (email) => {
    const user = await this.userDAO.mostrarId('email', email);

    return user;
  };
  editProfile = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
      await this.userDAO.actualizar(id, body);
      res.status(200).send('Perfil actualizado');
    } catch (error) {
      res.status(400).send('Status: No se ha podido actualizar');
    }
  };

  
  login = async (req, email, password, done) => {
    try {
      const user = await this.userDAO.mostrarId('email', email);

      if (!user) {
        return done(null, false, req.flash('signinMessage', 'No User Found'));
      }

      bcrypt.compare(password, user.password, function (err, result) {
        if (result == true) {
          return done(null, user);
        } else {
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
