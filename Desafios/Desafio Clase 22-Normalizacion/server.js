import express from "express";
import productosTestRuta from "./rutas/productosTestRuta.js";
import { normalizedHolding } from "./src/utils/normalizr.js";
import { createServer } from "http";
import { Server } from "socket.io";
import MensajesDAO from "./src/DAO/firebase.dao.js";
const mensajeClass = new MensajesDAO();
 
const app = express();
const httpServer = new createServer(app);
const io = new Server(httpServer);

app.use("/api/productos-test", productosTestRuta);

import hbs from "hbs";
import bodyParser from "body-parser";
import path from "path";

const __dirname = path.resolve();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views"); //Folder views (templates)
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
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

    console.log("----------------NORMALIZADO--------");
    console.log("normalizedHolding", normalizar);

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
