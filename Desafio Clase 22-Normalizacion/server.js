import express from "express";
import productosTestRuta from "./rutas/productosTestRuta.js";

import hbs from "hbs";
import bodyParser from "body-parser";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";



const app = express();
const httpServer = new createServer(app);
const io = new Server(httpServer);

app.use("/api/productos-test", productosTestRuta);

const __dirname = path.resolve();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views"); //Folder views (templates)
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));



import MensajesDao from "./src/DAO/mongodb.dao.js";
const mensajeClass = new MensajesDao();

app.get("/", (req, res) => {
  res.render("chat.hbs");
});

io.on("connection", async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);
  socket.emit("mensajes", await mensajeClass.mostrarTodos());
  socket.on("mensajeNuevo", async (msg) => {
    await mensajeClass.guardar(msg)
    io.sockets.emit("mensajes", await mensajeClass.mostrarTodos());
  });
});


/* ---------------------- Servidor ----------------------*/
const PORT = process.env.PORT || 8080;
const server = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
