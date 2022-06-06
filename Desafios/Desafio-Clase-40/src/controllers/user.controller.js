const {UserDAOMongoDB} = require('../services/DAOMongo');
const bcrypt = require('bcrypt');
const sendEmail = require('../../notificaciones/emails/Registration/newUser')
const UserDAO = new UserDAOMongoDB();


const UserController = {
  renderRegisterForm: (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/api/productos');
    }
    res.render('register', {
      title: 'Register',
      layout: 'register',
      newUser: UserDAO,
    });
  },

  renderLoginForm: (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/api/productos');
    }
    res.render('login', { title: 'Login' });
  },

  renderLogOut: (req, res) => {
    req.logout();
    req.session.destroy();
    // req.flash('success', 'You are logged out');
    res.redirect('/login');
  },

  renderProfile: (req, res) => {
    console.log(req.user);

    res.render('profile', { title: 'Profile' });
  },

  register: async (req, email, password, done) => {
    const user = await UserDAO.existUser(email);

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

      await UserDAO.guardar(newUserRegister);
      done(null, newUserRegister, sendEmail(newUserRegister));
    }
  },
  existPassport: async  (req, email) => {
    const user = await UserDAO.mostrarId(email);
 
    return   user;
  },

  login: async (req, email, password, done) => {
    const user = await UserDAO.existUser(email);
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
  },
};

module.exports =  UserController;
