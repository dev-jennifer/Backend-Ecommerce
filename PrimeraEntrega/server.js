const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");


const routerProductos = require("./rutas/productosRutas");
const routerCarrito = require("./rutas/carritoRutas"); //Segmento de rutas 1

const app = express();
const hbs = require('hbs');
const path = require("path");
app.use(express.static('public'));

app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views"); //Folder views (templates)
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});
app.use(express.static(__dirname));

/* ---------------------- Rutas ----------------------*/



/* ---------------------- Middlewares ---------------------- */
app.use(morgan('tiny'));
routerProductos.use(express.json());
routerCarrito.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));





/*Agregamos routers a la app*/
app.use("/productos", routerProductos);
app.use("/api/carrito", routerCarrito);



/* ---------------------- Servidor ----------------------*/
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
