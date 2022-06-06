const express = require('express'),
  flash = require('connect-flash'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  connectMongo = require('connect-mongo'),
  { createServer } = require('http'),
  cluster = require('cluster'),
  logger = require('./logger'),
  CONFIG = require('./src/utils/config'),
  CONFIG_SERVER = require('./src/utils/configServer'),
 morgan = require('morgan'), 
 path=require("path")
 compression = require('compression'),
  { engine } = require('express-handlebars'),
 { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access'),
 exphbs = require('express-handlebars');
 
const routerProducts = require('./src/routes/products.router'),
  routerCart = require('./src/routes/cart.router'),
  routerOrder = require('./src/routes/order.router'),
  routerUser = require('./src/routes/user.router'),
  routerEmail = require('./src/routes/email.router');
const app = express();

// app.use(express.static(__dirname + '/public'));


app.use(compression());
app.use(morgan('tiny'));

 
app.use('/uploads', express.static('uploads'));
const Handlebars = require('handlebars');
app.engine(
  '.hbs',
  exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, 'public/views/partials'),
    layoutsDir: path.join(__dirname, 'public/views/layouts'),
     handlebars: allowInsecurePrototypeAccess(Handlebars) 
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(express.static('public'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = new createServer(app);

const MongoStore = connectMongo.create({
  mongoUrl: CONFIG.MONGO_DB.MONGO_CONNECT.connection_string,
  //expiracion autorenovable
  ttl: 60,
});

app.use(cookieParser());
app.use(
  session({
    store: MongoStore,
    secret: '123456789!@#$%^&*()',
    resave: false,
    saveUninitialized: false,
    rolling: true,
  })
);
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  next();
});

app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCart);
app.use('/api/pedido', routerOrder);
app.use('/template/email', routerEmail);
app.use('/', routerUser);
app.get('/*', (req, res) => {
  res.status(400).json({
    msg: "error : 404, descripcion: ruta  no implementada",
  });
});
/* ---------------------- Servidor ----------------------*/

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

//node -prof server.js 8080 FORK
//$ curl -X GET "http://localhost:8080/api/productoso"

//node --prof-process ArtilleryResult_ConsoleActivate-v8.log > ProfResultConsole.txt
//node --prof-process ArtilleryResult_ConsoleNOActivate-v8.log > ProfResultNOConsole.txt

//node -prof server.js 8080 FORK
//autocannon -c 100 -d 20 -p 1 http://localhost:8080/api/productos
//node --prof-process isolate-000002AEEBA74ED0-13428-v8.log > AutocanonResultConsole.txt

//0x server.js
