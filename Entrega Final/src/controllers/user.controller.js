const bcrypt = require('bcrypt'),
  APIError = require('../classes/Error/customError'),
  sendEmail = require('../notificaciones/emails/Registration/newUser'),
  UserFactory = require('../classes/User/UserFactory.class'),
  { generateToken } = require('../passport/support');

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
      const mensaje = 'Error al cerrar sesion';
      res.render('error401', new APIError(error, mensaje));
    }
  };

  register = async (req,  email, password, done) => {
    try {
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

        await this.userDAO.guardar(newUserRegister);
        done(null, newUserRegister, sendEmail(newUserRegister));

        // Generate JWT token
        res.send({ token: generateToken(newUserRegister) });
      }
    } catch (error) {
      const mensaje = 'Error al crear usuario';
        new APIError(error, mensaje) ;
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
      const mensaje = 'Error al editar el perfil';
      new APIError(error, mensaje);
    }
  };

  login = async (req,  email, password, done) => {
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
    } catch (error) {
      const mensaje = 'Error al iniciar sesion';
     new APIError(error, mensaje);
    }
  };
}

module.exports = UserController;