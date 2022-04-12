/*============================[Modulos]============================*/
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";

import passport from "passport";
import productosTestRuta from "./rutas/productosTestRuta.js";
import autentificacionRuta from "./rutas/autentificacionRuta.js";
import infoRuta from "./rutas/infoRuta.js";
import { createServer } from "http";
import { Server } from "socket.io";
import MensajesDAO from "./src/DAO/firebase.dao.js";
import hbs from "hbs";
import bodyParser from "body-parser";
import apiRandomRuta from "./rutas/apiRandomRuta.js";

const usuarios = []
const mensajeClass = new MensajesDAO();

const app = express();
const httpServer = new createServer(app);
const io = new Server(httpServer);


/*----------- Session -----------*/
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
  // console.log("---------------------sesions-------------");
  // console.log(res.locals.session);
  next();
});

const __dirname = path.resolve();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views"); //Folder views (templates)
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});

/*----------- passport -----------*/
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));


/*============================[Rutas]============================*/
app.use("/", autentificacionRuta);
app.use("/", productosTestRuta);
app.use("/info", infoRuta);
app.use("/api/randoms", apiRandomRuta);
app.get("/chat", (req, res) => {
  res.render("chat");
});

/*============================[Mensaje Socket]============================*/
io.on("connection", async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  socket.on("mensajeNuevo", async (msg) => {
    await mensajeClass.guardar(msg);
    const mensajeGuardados = await mensajeClass.mostrarTodos();

    const normalizar = normalizedHolding(mensajeGuardados);
    const longO = JSON.stringify(mensajeGuardados).length;
    const longN = JSON.stringify(normalizar).length;
    const porcentaje = (longN * 100) / longO;

    socket.emit("mensajes", {
      normalizedHolding: normalizar,
      porcentaje: porcentaje,
    });
  });
});

/* ---------------------- Servidor ----------------------*/
const PORT = process.env.PORT || 8081;
const server = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
