const express = require('express'),
  flash = require('connect-flash'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo'),
  cluster = require('cluster'),
  logger = require('./src/utils/loggers'),
  config = require('./src/utils/config'),
  morgan = require('morgan'),
  path = require('path'),
  compression = require('compression'),
  exphbs = require('express-handlebars'),
  cors = require('cors');
const os = require('os');
const app = express();
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const RouterProduct = require('./src/routes/products.router'),
  RouterCart = require('./src/routes/cart.router'),
  RouterOrder = require('./src/routes/order.router'),
  RouterUser = require('./src/routes/user.router'),
  RouterEmail = require('./src/routes/email.router'),
  RouterViews = require('./src/routes/views.router');
const chat = require('./src/routes/chat.router')(io);
app.use(function (req, res, next) {
  console.log('handling request for: ' + req.url);
  next();
});

app.use(compression());
app.use(morgan('tiny'));

app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/****  Configurando el cors de forma dinamica */
if (config.SERVER.entorno == 'development') {
  app.use(cors());
} else {
  app.use(
    cors({
      origin: `http://localhost:${config.SERVER.PORT}`,
      optionsSucessStatus: 200,
      methods: 'GET, PUT, POST, DELETE',
    })
  );
}

app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.MONGO_DB.MONGO_CONNECT.url,
      ttl: 120,
    }),
    secret: config.MONGO_DB.MONGO_CONNECT.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // one day
    },
  })
);

app.set('socketio', io);
app.set('io', io);

//---------Rutas evito sessiones----------///
app.use('/api/productos', new RouterProduct().start());
app.use('/template/email', new RouterEmail().start());
app.use('/chat', chat);
app.use('/api/carrito', new RouterCart().start());
app.use('/api/pedido', new RouterOrder().start());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//---------VIEWS----------///
app.use('/', new RouterViews().start());

//users
app.use('/', new RouterUser().start());

/* ---------------------- Servidor ----------------------*/

if (config.SERVER.modoCluster && cluster.isPrimary) {
  logger.info('CPUs:', config.SERVER.numeroCPUs);
  logger.info(`Master ${process.pid} is running`);

  for (let i = 0; i < config.SERVER.numeroCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    logger.info(`${worker.process.pid} cerrado`);
  });
} else {
  const server = httpServer.listen(config.SERVER.PORT, () => {
    logger.info(
      `Servidor HTTP escuchado en puerto ${
        server.address().port
      }  - ${new Date().toLocaleString()}`
    );
  });

  server.on('error', (error) => logger.error(`Error en servidor ${error}`));
}
