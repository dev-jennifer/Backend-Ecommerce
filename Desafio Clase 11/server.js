/* ---------------------- Modulos ----------------------*/
const express = require("express");
const Handlebars = require("handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const https = require("https");
/* ---------------------- Instancia de express ----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/* ---------------------- Middlewares ---------------------- */

const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const path = require("path");

//app.use('/static', express.static(__dirname + '/public/views'));
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ---------------------- Conf Motor ----------------------*/

app.set("view engine", "hbs");

app.set("views", __dirname + "/public/views"); //Folder views (templates)

app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutDir: __dirname + "/views/layouts",
    partialsDir: path.join(__dirname, "/views/partials"),
  })
);

/* ---------------------- Websocket ---------------------- */
const productos = [{ nombre: "hola", precio: 1 }];

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado! >${socket.id}`);

  /*Enviar historico*/
  socket.emit("productos", productos);
  /*Escuchar nuevo mensajes*/
  socket.on("productoNuevo", (data) => {
    productos.push(data);
    /*se actualiza vista */
    io.sockets.emit("productos", productos);
  });
});

/* ---------------------- Websocket ---------------------- */
const mensajes = [];

io.on("connection", (socket) => {
  socket.emit("mensajes", mensajes);
  socket.on("mensajeNuevo", (data) => {
    mensajes.push(data);
    io.sockets.emit("mensajes", mensajes);
  });
});

/* ---------------------- Rutas ----------------------*/
//app.get('/', (req, res) => res.send( {productos}));
// app.get('/', (req, res) => {
//   res.render('index', {productos});
// });

// app.get("/", (req, res) => {
//   res.render = (index,makeHtmlTable({ productos }) )
// });

/* ---------------------- Servidor ----------------------*/
const PORT = 8081;
const server = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
