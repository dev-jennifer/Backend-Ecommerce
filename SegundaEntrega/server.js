import express from "express";

/* ---------------------- Rutas ----------------------*/
import { routerProductos } from "./rutas/productosRutas.js";
import routerCarrito from "./rutas/carritoRutas.js";

const app = express();

//RENDER

import hbs from "hbs";
import bodyParser from "body-parser";
import path from "path";

//Vista solo para Productos
const __dirname = path.resolve();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.set("views", __dirname + "/public/views"); //Folder views (templates)
hbs.registerPartials(__dirname + "/public/views/partials", function (err) {});

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

/*Agregamos routers a la app*/
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);




/* ---------------------- Servidor ----------------------*/
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});
