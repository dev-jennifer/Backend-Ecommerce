import express from "express";
import productosTestRuta from "./rutas/productosTestRuta.js";
import { normalize, schema } from "normalizr";
import util from "util";

import { createServer } from "http";
import { Server } from "socket.io";
import MensajesDao from "./src/DAO/mongodb.dao.js";
const mensajeClass = new MensajesDao();

const app = express();
const httpServer = new createServer(app);
const io = new Server(httpServer);

app.use("/api/productos-test", productosTestRuta);

import hbs from "hbs";
import bodyParser from "body-parser";
import path from "path";
import { copyFileSync } from "fs";

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

function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true));
}
io.on("connection", async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  socket.on("mensajeNuevo", async (msg) => {
    await mensajeClass.guardar(msg);

    // ("\n ------------- OBJETO MONGO --------------- ");
    const mensajeGuardados = await mensajeClass.mostrarTodos();

    // console.log("\n ------------- OBJETO NORMALIZADO --------------- ");

    const user = new schema.Entity("author",{},{idAttribute: user =>  user.id });
    const commment = new schema.Entity("text", {
      escribeMensaje: user,
    });
    const chatIndiv = new schema.Entity("articles", {
      author: user,
      msg: [commment],
    });
    const mensajeSchema = new schema.Entity("mensaje", {
      msgs: [chatIndiv],
    });

    const normalizedHolding = normalize(mensajeGuardados, mensajeSchema);

    const longO = JSON.stringify(mensajeGuardados).length;
    const longN = JSON.stringify(normalizedHolding).length;
    console.log("\nLongitud objeto normalizado: ", longN);
    const porcentaje = (longN * 100) / longO;

    console.log("----------------NORMALIZADO--------");
    console.log("BIR", normalizedHolding);
    socket.emit("mensajes", {
      normalizedHolding: normalizedHolding,
      mensajeSchema: mensajeSchema,
      porcentaje: porcentaje,
    });
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
