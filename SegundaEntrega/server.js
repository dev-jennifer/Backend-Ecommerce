import express from "express";
import routerProductos from "./rutas/productosRutas.js"
import routerCarrito from "./rutas/carritoRutas.js";
const app = express();

// const { Server: HttpServer } = require("http");
// const { Server: IOServer } = require("socket.io");

//RENDER

import hbs from "hbs"
import morgan from "morgan";
import bodyParser from "body-parser"
import path from 'path';

const __dirname = path.resolve();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views"); //Folder views (templates)
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// const httpServer = new HttpServer(app);
// const io = new IOServer(httpServer);

// app.use(morgan("tiny"));


// routerProductos.use(express.json());
// routerCarrito.use(express.json());

/*Agregamos routers a la app*/
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

// app.get('/', (req, res) => {
//   res.render('inicio.hbs');
// });



/* ---------------------- Servidor ----------------------*/
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
