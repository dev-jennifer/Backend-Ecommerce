const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const routerProductos = require("./rutas/productosRutas");

const app = express();
const hbs = require("hbs");
const path = require("path");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views"); //Folder views (templates)
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});
app.use(express.static(__dirname));
app.use(bodyParser.json());

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));

routerProductos.use(express.json());

/*Agregamos routers a la app*/
app.use("/api/productos", routerProductos);

app.get("/", (req, res) => {
  res.render("inicio.hbs");
});

/* ---------------------- CHAT ---------------------- */

const { options } = require("./src/utils/options");
const Chat = require("./src/Chat.js");
const ChatClass = new Chat(options.sqlite2);

io.on("connection", async (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

  socket.emit("mensajes", await ChatClass.mostrarTodos());

  socket.on("mensajeNuevo", async (msg) => {
 
    await ChatClass.guardar(msg);

      io.sockets.emit("mensajes", await ChatClass.mostrarTodos());
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
