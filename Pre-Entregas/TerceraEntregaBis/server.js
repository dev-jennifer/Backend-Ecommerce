const express = require('express'),
      flash = require('connect-flash'),
      hbs = require('hbs'),
      bodyParser = require('body-parser'),
      path = require('path'),
      passport = require('passport'),
      cookieParser  = require( 'cookie-parser'),
      session  = require( 'express-session'),
      connectMongo  = require( 'connect-mongo'),
      dotenv = require( 'dotenv');

const { routerProductos } = require('./rutas/productosRutas'),
      routerCarrito = require('./rutas/carritoRutas'),
      autentificacionRuta = require('./rutas/autentificacionRuta');

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/public/views');
hbs.registerPartials(__dirname + '/public/views/partials', function(err) {});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



dotenv.config({ silent: process.env.NODE_ENV === 'production' });

// const httpServer = new createServer(app);
// const io = new Server(httpServer);

const MongoStore= connectMongo.create({
  mongoUrl:`mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env
	.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME_SESSION}?retryWrites=true&w=majority`,
  //expiracion autorenovable
  ttl: 60
})

app.use(cookieParser())
app.use(session({
  store: MongoStore,
  secret: '123456789!@#$%^&*()',
  resave: false,
  saveUninitialized: false,
  rolling: true,
}));
 
 
app.use(function(req, res, next){
  res.locals.session = req.session;
  console.log(res.locals.session);
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
	app.locals.signinMessage = req.flash('signinMessage');
	app.locals.signupMessage = req.flash('signupMessage');
	app.locals.user = req.user;
	console.log(app.locals);
	next();
});

app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);
app.use('/', autentificacionRuta);

 

/* ---------------------- Servidor ----------------------*/
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Servidor escuchando en puerto ${PORT}`);
});

server.on('error', (error) => {
	console.error(`Error en el servidor ${error}`);
});
