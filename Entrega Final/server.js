const express = require('express'),
  flash = require('connect-flash'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  connectMongo = require('connect-mongo'),
  // { createServer } = require('http'),
  cluster = require('cluster'),
  logger = require('./src/utils/loggers'),
  config = require('./src/utils/config'),
  CONFIG_SERVER = require('./src/utils/configServer'),
  morgan = require('morgan'),
  path = require('path'),
  compression = require('compression'),
  //{ engine } = require('express-handlebars'),
  exphbs = require('express-handlebars'),
  cors = require('cors');

require('./src/passport/local-auth');

// const Handlebars = require('handlebars');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const RouterProduct = require('./src/routes/products.router'),
  RouterCart = require('./src/routes/cart.router'),
  RouterOrder = require('./src/routes/order.router'),
  RouterUser = require('./src/routes/user.router'),
  RouterEmail = require('./src/routes/email.router'),
  RouterViews = require('./src/routes/views.router');

const app = express();

// app.use(express.static(__dirname + '/public'));

app.use(compression());
app.use(morgan('tiny'));
// middleware

app.use('/uploads', express.static('uploads'));

app.engine(
  '.hbs',
  exphbs.engine({
    helpers: require('./public/js/helpers.js').helpers,
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'public/views/partials'),
    layoutsDir: path.join(__dirname, 'public/views/layouts'),
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/****  Configurando el cors de forma dinamica */
if (config.SRV.entorno == 'development') {
  app.use(cors());
} else {
  app.use(
    cors({
      origin: 'http://localhost:8080',
      optionsSucessStatus: 200,
      methods: 'GET, PUT, POST',
    })
  );
}

//----------COOKIES------------//
app.use(cookieParser());
const MongoStore = connectMongo.create({
  mongoUrl: config.MONGO_DB.MONGO_CONNECT.url,
  ttl: 30000,
});
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    store: MongoStore,
    secret: '123456789!@#$%^&*()',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: oneDay },
  })
);
//----------------------//

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;

  next();
});
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

//---------VIEWS----------///

app.use('/', new RouterViews().start());

//---------ROUTER----------///
app.use('/api/productos', new RouterProduct().start());
app.use('/api/carrito', new RouterCart().start());
app.use('/api/pedido', new RouterOrder().start());
app.use('/template/email', new RouterEmail().start());
app.use('/', new RouterUser().start());

// app.get('/*', (req, res) => {
//   res.status(400).json({
//     msg: "error : 404, descripcion: ruta  no implementada",
//   });
// });

/* ---------------------- Servidor ----------------------*/

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
app.get('/chat', (req, res) => {
  res.render('chat');
});

/*============================[Mensaje Socket]============================*/
io.on('connection', async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  socket.on('mensajeNuevo', async (msg) => {
    await mensajeClass.guardar(msg);
    const mensajeGuardados = await mensajeClass.mostrarTodos();

    const normalizar = normalizedHolding(mensajeGuardados);
    const longO = JSON.stringify(mensajeGuardados).length;
    const longN = JSON.stringify(normalizar).length;
    const porcentaje = (longN * 100) / longO;

    socket.emit('mensajes', {
      normalizedHolding: normalizar,
      porcentaje: porcentaje,
    });
  });
});

// For Master process
if (CONFIG_SERVER.modoCluster && cluster.isPrimary) {
  logger.info('CPUs:', CONFIG_SERVER.numeroCPUs);
  logger.info(`Master ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < CONFIG_SERVER.numeroCPUs; i++) {
    cluster.fork();
  }
  // This event is firs when worker died
  cluster.on('exit', (worker) => {
    logger.info(`worker ${worker.process.pid} died`);
  });
} else {
  // For Worker
  const server = httpServer.listen(CONFIG_SERVER.PORT, () => {
    logger.info(
      `Servidor HTTP escuchado en puerto ${server.address().port} - PID ${
        process.pid
      } - ${new Date().toLocaleString()}`
    );
  });
  server.on('error', (error) => logger.error(`Error en servidor ${error}`));
}
