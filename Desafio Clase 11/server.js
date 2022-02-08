/* ---------------------- Modulos ----------------------*/
const fs = require('fs')
var handlebars = require("handlebars");
const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");


/* ---------------------- Instancia de express ----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/* ---------------------- Middlewares ---------------------- */

const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');


app.use(express.static('public'));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

/* ---------------------- Conf Motor ----------------------*/
app.set('views', path.join(__dirname, 'views'));


app.engine( 'hbs', exphbs.engine( { 
    extname: 'hbs', 
    defaultLayout: 'main', 
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
  } ) );
  
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

/* ---------------------- Websocket ---------------------- */
const productos = []

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
  /*Enviar historico*/
  socket.emit("mensajes", mensajes);
  /*Escuchar nuevo mensajes*/
  socket.on("mensajeNuevo", (data) => {
    mensajes.push(data);
    /*se actualiza vista */
    io.sockets.emit("mensajes", mensajes);
  });
});


/* ---------------------- Rutas ----------------------*/

// app.get('/', (req, res) => {
//   // get data from the other site
//   res.render('index', productos)
// });

/* ---------------------- Servidor ----------------------*/
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
 