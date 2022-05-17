const express = require('express'),
 	bcrypt = require('bcrypt'),
    passport = require('passport'),
	passportLocal = require('passport-local');

const LocalStrategy = passportLocal.Strategy;

const UserDao = require('../src/DAOs/User.dao.mongo'),
	  newUser = new UserDao()

const autentificacionRuta = express.Router();


autentificacionRuta.get('/register', function(req, res) {
	res.render('register', { title: 'Register', newUser: newUser });
});


autentificacionRuta.post(
	'/register',
	passport.authenticate('local-signup', {
		successRedirect : '/api/productos',
		failureRedirect : '/register'
	})
);


// function isAuthenticated(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}

// 	res.redirect('/');
// }
// Log in Form
autentificacionRuta.get('/login', function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/secure');
	}
	res.render('login', { title: 'Log in' });
});

// Log in Process
autentificacionRuta.post('/login', function(req, res, next) {
	passport.authenticate('local', {
		successRedirect : '/secure',
		failureRedirect : '/users/login'
	})(req, res, next);
});

// // Log out
// autentificacionRuta.get('/logout', function(req, res) {
// 	req.logout();
// 	req.flash('success', 'You are logged out');
// 	res.redirect('/users/login');
// });

// autentificacionRuta.post('/login', (req, res) => {
// 	req.session.nombre = req.body.name;
// 	res.redirect('/');
// });
// autentificacionRuta.get('/login', (req, res) => {
// 	const nombre = req.session.nombre;

// 	if (nombre) {
// 		res.redirect('/');
// 	} else {
// 		res.render('login.hbs');
// 	}
// });

autentificacionRuta.get('/logout', (req, res) => {
	const nombre = req.session.nombre;

	if (nombre) {
		res.render('logout.hbs');
		try {
			req.session.destroy();
			res.set({ Refresh: '2; url=/login' });
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/');
	}
});

passport.serializeUser(function(user, done) {
	done(null, user.email);
});

passport.deserializeUser(async (id, done) => {
	const user = await newUser.existUser(id);
	done(null, user);
});

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
				let newUserRegister = {
					email    : email,
					password : password,
					name     : req.body.name,
					surname  : req.body.surname,
					address  : req.body.address,
					age      : req.body.age,
					phone    : req.body.phone,
					avatar   : req.body.avatar
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
			const user = await existUser.findOne(email);
			if (!user) {
				return done(null, false, req.flash('signinMessage', 'No User Found'));
			}
			if (!user.comparePassword(password)) {
				return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
			}
			return done(null, user);
		}
	)
);

/*----------- Passport -----------*/
// passport.use(new LocalStrategy(
//     (username, password, done)=>{
//         //Logica para validar si un usuario existe
//         const existeUsuario = usuariosDB.find(usuario => {
//             return usuario.nombre == username;
//         });

//         if (!existeUsuario) {
//             console.log('Usuario no encontrado')
//             return done(null, false);
//         }

//         if(!(existeUsuario.password == password)){
//             console.log('Contrase;a invalida')
//             return done(null, false);
//         }

//         return done(null, existeUsuario);
//     }
// ))

// passport.serializeUser((usuario, done)=>{
//     done(null, usuario.nombre);
// })

// passport.deserializeUser((nombre, done)=>{
//     const usuario = usuariosDB.find(usuario => usuario.nombre == nombre);
//     done(null, usuario);
// });

module.exports = autentificacionRuta;
