const express = require("express");
const routerProductos = express.Router();
const Contenedor = require("../Contenedor.js");
/*Mascotas*/

const archivo = new Contenedor("productos");

//GET '/api/productos' -> devuelve todos los productos.
routerProductos.get("/", (req, res) => {
  try {
    res.send(archivo.getAll());
    res.end();
  } catch (error) {
    res.send({
      code: 400,
      failed: "Error",
    });
  }
});

//GET '/api/productos/:id' -> devuelve un producto según su id.

routerProductos.get("/:id", function (req, res) {
  const valueID = req.params.id;

  try {
    res.send(archivo.getById(parseInt(valueID)));
    res.end();
  } catch (error) {
    res.send({
      code: 400,
      failed: "Error",
    });
  }
});

routerProductos.post("/", (req, res) => {
  let mascota = req.body;
  mascotas.push(mascota);
  console.log("Post mascotas");
  res.status(200).json({ msg: "Agregado!", data: mascota });
});

module.exports = routerProductos;
