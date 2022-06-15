const UserController = require('../controllers/user.controller');
 
const userController = new UserController(),
  passport = require('passport'),
    passportLocal = require('passport-local'),
    LocalStrategy = passportLocal.Strategy;


passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    userController.register
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
        userController.login
      )
    );
    
passport.serializeUser(function (user, done) {
  console.log("user", user.email)
  done(null, user.email);
});
passport.deserializeUser(async (email, done) => {
  try {
    const user = await userController.existPassport(email);
    done(null, user)
  } catch (error) {
    done(error);
  }
});
