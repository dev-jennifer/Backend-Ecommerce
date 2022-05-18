const express = require('express'),
 	bcrypt = require('bcrypt'),
    passport = require('passport'),
	passportLocal = require('passport-local'),
    multer = require("multer"),
     path = require('path')
const LocalStrategy = passportLocal.Strategy;

const UserDao = require('../src/DAOs/User.dao.mongo'),
	  newUser = new UserDao()

const autentificacionRuta = express.Router();


passport.serializeUser(function(user, done) {
	done(null, user.email);
});

passport.deserializeUser(async (id, done) => {
	const user = await newUser.existUser(id);
	done(null, user);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });



// function middleware(req, res, next) {

//     var imageName;

//     var uploadStorage = multer.diskStorage({
//         destination: function (req, file, cb) {

//             cb(null, path.join(__dirname, '../public/uploads'));
 
//         },
//         filename: function (req, file, cb) {
//             imageName = file.originalname;
//             //imageName += "_randomstring"
//             cb(null, imageName);
//         }
//     });


//     var upload = multer({storage: uploadStorage});

//     var uploadFile = upload.single('avatar');

//     uploadFile(req, res, function (err) {
//         req.imageName = imageName;
//         req.uploadError = err;
//         next();
//     })
// }

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
				 upload.single("avatar")
				req.body.email = email;
				password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(5), null);
				let newUserRegister = {
					email    : email,
					password : password,
					image :   req.body.avatar,
					name     : req.body.name,
					surname  : req.body.surname,
					address  : req.body.address,
					age      : req.body.age,
					phone    : req.body.phone
 
				};

				console.log(newUserRegister);
				await newUser.guardar(newUserRegister);

				done(null, newUserRegister);
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
			 console.log("email", email)
		     console.log("Password", password)
		 	 console.log("Password user", user.password)
			bcrypt.compare(password, user.password, function(err, result) {
				if (result == true){
						return done(null, user);
				} else{
					return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
				}}
				)
 
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
	passport.authenticate('local-signup', {
		successRedirect : '/api/productos',
		failureRedirect : '/register'
	})
);


function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();	}
	res.redirect('/');
}

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
