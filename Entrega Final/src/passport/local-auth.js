const UserController = require('../controllers/user.controller'),
  CONFIG = require('../utils/config'),
  UserFactory = require('../classes/User/UserFactory.class'),
  sendEmail = require('../notificaciones/emails/Registration/newUser'),
  userController = new UserController(),
  passport = require('passport'),
  passportLocal = require('passport-local'),
  { Strategy } = require('passport-facebook'),
  LocalStrategy = passportLocal.Strategy,
  FacebookStrategy = Strategy,
  GoogleStrategy = require('passport-google-oauth2').Strategy;
 

  
authUser = async (request, accessToken, refreshToken, profile, cb) => {
  const exist = await UserFactory.get().mostrarEmail(
    profile.emails[0].value
  );
  if (exist) {
    cb(null, profile);
  } else {
    console.log(profile);
    const newUserRegister = {
      email: profile.emails[0].value,
      name: profile.name.givenName,
      lastName: profile.name.familyName,
      membershipID: 2,
      avatar: profile.photos[0].value,
      ref: 'Facebook',
    };
    await UserFactory.get().guardar(newUserRegister);
    cb(null, newUserRegister, sendEmail(newUserRegister));
  }
};
passport.use(
  new GoogleStrategy(
    {
      clientID: CONFIG.GOOGLE.GOOGLE_ID,
      clientSecret: CONFIG.GOOGLE.GOOGLE_SECRET,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true,
    },
    authUser
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: CONFIG.FACEBOOK.FACE_APP_ID,
      clientSecret: CONFIG.FACEBOOK.FACE_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: [
        'id',
        'emails',
        'link',
        'name',
        'updated_time',
        'verified',
        'displayName',
        'photos',
      ],
    },
    authUser
  )
);

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
  done(null, {
    name: user.name.givenName ? user.name.givenName : user.name,
    email: user.email ? user.email : user.emails[0].value,
    membership: user.membershipID ? user.membershipID : 2,
  });
});

passport.deserializeUser(async (user, done) => {
  console.log(user);
  try {
    const userDetail = await userController.existPassport(
     user.email ? user.email : user._json.email
      
    );
    done(null, userDetail);
  } catch (error) {
    done(error);
  }
});
