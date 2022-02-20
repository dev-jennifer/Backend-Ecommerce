const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");


const isAdmin=true
const routerProductos = require("./rutas/productosRutas");
const routerCarrito = require("./rutas/carritoRutas"); //Segmento de rutas 1

const app = express();
const hbs = require('hbs');
const path = require("path");
// app.use(express.static('public'));
app.use(express.static(__dirname +'/public' ))
app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views"); //Folder views (templates)
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});
app.use(express.static(__dirname));
app.use(bodyParser.json())
/* ---------------------- Rutas ----------------------*/



/* ---------------------- Middlewares ---------------------- */
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));

routerProductos.use(express.json());
routerCarrito.use(express.json());
/*Agregamos routers a la app*/
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);



app.get('/', (req, res) => {
  res.render('inicio.hbs');
});

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

io.on("connection", (socket) => {
  socket.on('storeClientInfo', (data) => {
      console.log("connected custom id:", data.customId);
      socket.customId = data.customId;
  });

  socket.on("disconnect", () => {
      console.log("disconnected custom id:", socket.customId);
  })
});
/* ---------------------- Servidor ----------------------*/
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
 
server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
 
 