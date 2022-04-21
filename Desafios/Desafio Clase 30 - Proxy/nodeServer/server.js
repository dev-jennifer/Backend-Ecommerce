import express from 'express';
import session  from 'express-session';
import cookieParser   from 'cookie-parser';
import passport  from 'passport'

import productosTestRuta  from './rutas/productosTestRuta.js';
import autentificacionRuta  from './rutas/autentificacionRuta.js';
import infoRuta  from './rutas/infoRuta.js';

import hbs from 'hbs';
import bodyParser  from 'body-parser';
import apiRandomRuta  from './rutas/apiRandomRuta.js';

const app = express();


/*----------------------------- Session ------------------------------*/
app.use(cookieParser());
app.use(
  session({
    secret: "1234567890!@#$%^&*()",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "auto",
      maxAge: 60000,
    },
  })
);
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});
import path from "path";
const __dirname = path.resolve();
 
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views");
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});
/*-------------------------- Passport ------------------------------*/
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
/*---------------------------- Rutas --------------------------------*/
app.use("/", autentificacionRuta);
app.use("/", productosTestRuta);
app.use("/info", infoRuta);
app.use("/api/randoms", apiRandomRuta);

 
// pm2 start server.js --name="Server1" --watch -- port=8081 

const PORT = parseInt(process.argv[2]) || 8080
app.listen(PORT, err => {
  console.log(PORT)
    if(!err) console.log(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`)
})
