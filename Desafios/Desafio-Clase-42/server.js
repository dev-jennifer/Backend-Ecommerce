const express = require('express'),
  flash = require('connect-flash'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  connectMongo = require('connect-mongo'),
  { createServer } = require('http'),
  cluster = require('cluster'),
  logger = require('./src/utils/loggers'),
  config = require('./src/utils/config'),
  CONFIG_SERVER = require('./src/utils/configServer'),
  morgan = require('morgan'),
  path = require('path');
 compression = require('compression'),
  { engine } = require('express-handlebars'),
 exphbs = require('express-handlebars'),
 cors=require('cors')
 require("./src/passport/local-auth")
 const Handlebars = require('handlebars');
 

const RouterProduct = require('./src/routes/products.router'),
  RouterCart = require('./src/routes/cart.router'),
  RouterOrder = require('./src/routes/order.router'),
  RouterUser = require('./src/routes/user.router'),
  RouterEmail = require('./src/routes/email.router');
const app = express();

// app.use(express.static(__dirname + '/public'));


 
app.use(compression());
app.use(morgan('tiny'));
// middleware



app.use('/uploads', express.static('uploads'));

app.engine(
  '.hbs',
  exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, 'public/views/partials'),
    layoutsDir: path.join(__dirname, 'public/views/layouts')
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
/****  Configurando el cors de forma dinamica */
if (config.SRV.entorno == 'development') {
 
  app.use(cors());
} else {
  app.use(
    cors({
      origin: 'http://localhost:5000',
      optionsSucessStatus: 200,
      methods: 'GET, PUT, POST',
    })
  );
}

const MongoStore = connectMongo.create({
  mongoUrl: config.MONGO_DB.MONGO_CONNECT.connection_string,
  //expiracion autorenovable
  ttl: 120,
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
