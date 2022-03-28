const express = require("express");
const Contenedor = require("./Contenedor.js");

const fs = require("fs");

const app = express();
const PORT = 8080

const getProductos = () => {
  let contenidoExistente;
  let ruta = "./data/productos.txt";
  try {
    contenidoExistente = fs.readFileSync(ruta, "utf-8");
    return JSON.parse(contenidoExistente);
  } catch (error) {
    throw new Error("No se ha podido leer el archivo");
  }
};
 
/* ---------------------- Modulos ----------------------*/
const express = require('express');
const morgan = require('morgan');

const bodyParser = require('body-parser');
 
const routerProductos = require('./rutas/productos.rutas');//Segmento de rutas 1

/* ---------------------- Instancia de express ----------------------*/
const app = express();

/* ---------------------- Middlewares ---------------------- */
app.use(morgan('tiny'));
routerProductos.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ---------------------- Rutas ----------------------*/
/*Agregamos routers a la app*/
app.use('/api/productos', routerProductos);

/* ---------------------- Servidor ----------------------*/
const PORT = 8080;
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})
server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
})