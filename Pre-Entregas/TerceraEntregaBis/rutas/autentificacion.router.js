const express = require('express'),
	bcrypt = require('bcrypt'),
	passport = require('passport'),
	passportLocal = require('passport-local'),
	multer = require('multer')

const LocalStrategy = passportLocal.Strategy;
const {sendEmail} = require("../notificaciones/newUser")

const UserDao = require('../src/DAOs/User.dao.mongo'),
	newUser = new UserDao();

const autentificacionRuta = express.Router();

passport.serializeUser(function(user, done) {
	done(null, user.email);
});

passport.deserializeUser(async (id, done) => {
	const user = await newUser.existUser(id);
	done(null, user);
});



function middleware(req, res, next) {

    var imageName;

    var uploadStorage = multer.diskStorage({
        destination: function (req, file, cb) {

             cb(null, "./public/uploads");
 
        },
        filename: function (req, file, cb) {
			 var originalname = file.originalname;
        var extension = originalname.split(".");
        filename = Date.now() + '.' + extension[extension.length-1];

            cb(null, filename);
        }
    });

    var upload = multer({storage: uploadStorage}) ;
    var uploadFile = upload.single('avatar');

    uploadFile(req, res, function (err) {
        req.imageName = imageName;
        req.uploadError = err;

        next();
    })
}


passport.use(
	'local-signup',
	new LocalStrategy(
		{
			usernameField     : 'email',
			passwordField     : 'password',
			passReqToCallback : true
		},
		async (req, email, password, done) => {
			const user = await newUser.existUser(email);

			if (user) {
				return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
			} else {
			 
				req.body.email = email;
				password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(5), null);
				console.log(req)
				let newUserRegister = {
					email    : email,
					password : password,
					name     : req.body.name,
					surname  : req.body.surname,		
					address  : req.body.address,
					age      : req.body.age,
					phone    : req.body.phone,
					avatar:  req.file.filename
				};
 			

				await newUser.guardar(newUserRegister);

				done(null, newUserRegister, sendEmail(newUserRegister.email));
			}
		}
	)
);

passport.use(
	'local-signin',
	new LocalStrategy(
		{
			usernameField     : 'email',
			passwordField     : 'password',
			passReqToCallback : true
		},
		async (req, email, password, done) => {
			const user = await newUser.existUser(email);
			if (!user) {
				return done(null, false, req.flash('signinMessage', 'No User Found'));
			}
	 
			bcrypt.compare(password, user.password, function(err, result) {
				if (result == true) {

					return done(null, user);

				} else {
					return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
				}
			});
		}
	)
);

autentificacionRuta.get('/register', function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/api/productos');
	}
	res.render('register', { title: 'Register', newUser: newUser });
});





autentificacionRuta.post(
	'/register',
      middleware,
	passport.authenticate('local-signup', {
		successRedirect : '/api/productos',
		failureRedirect : '/register'
	})
)

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		console.log(req.isAuthenticated)
		return next();
	}
	res.redirect('/');
}
autentificacionRuta.get('/profile',isAuthenticated, (req, res, next) => {
  res.render('profile');
 
});

// Log in Form
autentificacionRuta.get('/login', function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/api/productos');
	}
	res.render('login', { title: 'Log in' });
});



// Log in Process
autentificacionRuta.post('/login', function(req, res, next) {
	passport.authenticate('local-signin', {
		successRedirect : '/api/productos',
		failureRedirect : '/login'
	})(req, res, next);
});

 

// Log out
autentificacionRuta.get('/logout', function(req, res) {
	req.logout();
	req.session.destroy();
	// req.flash('success', 'You are logged out');
	res.redirect('/login');
});

module.exports = autentificacionRuta;
