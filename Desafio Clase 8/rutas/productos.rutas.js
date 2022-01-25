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
      failed: { error: "producto no encontrado" },
    });
  }
});

//POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.

routerProductos.post("/", (req, res) => {
  let productos = {
    title: req.body.title,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
  };
  res.send(archivo.save(productos));
 
  res.end();
 
});

module.exports = routerProductos;





