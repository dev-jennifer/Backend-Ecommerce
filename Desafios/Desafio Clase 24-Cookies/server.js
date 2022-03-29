import express from "express";
import productosTestRuta from "./rutas/productosTestRuta.js";
import autentificacionRuta from "./rutas/autentificacionRuta.js";

import { normalizedHolding } from "./src/utils/normalizr.js";
import { createServer } from "http";
import { Server } from "socket.io";

import MensajesDAO from "./src/DAO/firebase.dao.js";
import bodyParser from "body-parser";
import hbs from "hbs";
import path from "path";
import options from "./src/utils/options.js";

const mensajeClass = new MensajesDAO();

import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo'

const MongoStore= connectMongo.create({
  mongoUrl:options.mongoAtlas.mongourl
})

const app = express();
const httpServer = new createServer(app);
const io = new Server(httpServer);


app.use(cookieParser())
app.use(session({
  store: MongoStore,
  secret: '123456789!@#$%^&*()',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 60000
}
}));


const __dirname = path.resolve();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views"); //Folder views (templates)
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/",autentificacionRuta);
app.use("/api/productos",productosTestRuta);
app.use("/", (req, res) => {
  res.render("index.hbs");
});
 

app.get("/chat", (req, res) => {
  res.render("chat.hbs");
});
 

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
