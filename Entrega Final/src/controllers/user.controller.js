const bcrypt = require('bcrypt'),
  APICustom = require('../classes/Error/customError'),
  sendEmail = require('../notificaciones/emails/Registration/newUser'),
  UserFactory = require('../classes/User/UserFactory.class');
//   { generateToken, auth } = require('../passport/support');
//const jwt = require('jsonwebtoken');

class UserController {
  constructor() {
    this.userDAO = UserFactory.get();
    this.message = new APICustom();
  }

  renderProfile = (req, res) => {
    const user = req.user._json ? req.user._json : req.user;
    res.render('profile', { user: user });
  };

  renderLogOut = (req, res, next) => {
    try {
      req.session.destroy((err) => {
        res.clearCookie('jwt');
        res.redirect('/');

        if (err) next(err);
      });
    } catch (error) {
      const mensaje = 'Error al cerrar sesion';
      this.message.errorInternalServer(error, mensaje);
    }
  };
  register = async (req, email, password, done) => {
    try {
      const user = await this.userDAO.mostrarEmail(email);
      console.log('U', user);
      if (user) {
         console.log("aqui1")
        return done(
          null,false,req.flash('signupMessage', 'The Email is already Taken.')
        );
      } else {
        req.body.email = email;
        password = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(5),
          null
        );

        const phoneFull = '+' + req.body.country + req.body.phone;
        const newUserRegister = {
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
        console.log('newUserRegister', newUserRegister);
        await this.userDAO.guardar(newUserRegister);
        done(null, newUserRegister, sendEmail(newUserRegister));
      }
    } catch (error) {
      const mensaje = 'Error al crear usuario';
      this.message.errorInternalServer(error, mensaje);
    }
  };

  existPassport = async (email) => {
    const user = await this.userDAO.mostrarEmail(email);
    return user;
  };

  editProfile = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try {
      await this.userDAO.actualizar(id, body);
      res.status(200).send('Perfil actualizado');
    } catch (error) {
      const mensaje = 'Error al editar el perfil';
      this.message.errorInternalServer(error, mensaje);
    }
  };

  login = async (req, email, password, done) => {
    try {
      const user = await this.userDAO.mostrarEmail(email);

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
    } catch (error) {
      const mensaje = 'Error al iniciar sesion';
      this.message.errorInternalServer(error, mensaje);
    }
  };
}

module.exports = UserController;
