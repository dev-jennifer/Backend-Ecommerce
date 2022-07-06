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



//

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACE_APP_ID,
//       clientSecret: FACE_APP_SECRET,
//       callbackURL: 'http://localhost:8080/auth/facebook/callback',
//       profileFields: ['id', 'displayName', 'photos', 'email'],
//     },

//     function (accessToken, refreshToken, profile, cb) {
//       console.log('accessToken: ', accessToken);
//       console.log('refreshToken: ', refreshToken);
//       console.log(profile);
//       cb(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });

// passport.deserializeUser((obj, cb) => {
//   cb(null, obj);
// });

// autentificacionRuta.get('/datos', (req, res) => {
//   if (req.isAuthenticated()) {
//     if (!req.user.contador) {
//       req.user.contador = 0;
//     }
//     req.user.contador++;

//     req.session.nombre = req.user.displayName;
//     req.session.foto = req.user.photos[0].value;
//     // email: req.user.emails[0].value,
//     res.redirect('/');
//   } else {
//     res.redirect('/');
//   }
// });

// autentificacionRuta.get('/logout', (req, res) => {
//   req.logout();
//   req.session.destroy();
//   res.redirect('/');
// });

// autentificacionRuta.get('/auth/facebook', passport.authenticate('facebook'));

// autentificacionRuta.get(
//   '/auth/facebook/callback',
//   passport.authenticate('facebook', {
//     failureRedirect: '/',
//     successRedirect: '/datos',
//     authType: 'reauthenticate',
//   })
// );
