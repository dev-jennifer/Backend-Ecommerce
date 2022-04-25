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

import cluster from "cluster";
import os from "os";

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
app.use("/api/random", apiRandomRuta);

 
// pm2 start server.js --name="Server1" --watch -- port=8081 
//pm2 start server.js --name="Server3" --watch -i max -- 8080
// Check the number of available CPU.

const numCPUs =  os.cpus().length;
 
 
const PORT = 8080;
 
// For Master process
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
 
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
 
  // This event is firs when worker died
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
 
// For Worker
else{
 
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  app.listen(PORT, err =>{
    err ?
    console.log("Error in server setup") :
    console.log(`Worker ${process.pid} started`);
  });
}