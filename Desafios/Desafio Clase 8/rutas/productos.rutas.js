const express = require("express");
const routerProductos = express.Router();

const productos = [];
//GET '/api/productos' -> devuelve todos los productos.
routerProductos.get("/", (req, res) => {
  try {
    res.status(200).json(productos);
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

  const index = productos.findIndex((x) => x.id === parseInt(valueID));
  if (index !== -1) {
    res.status(200).json(productos[index]);
  } else {
    res.send({
      code: 400,
      error: "producto no encontrado",
    });
  }
});

//POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
routerProductos.post("/", (req, res) => {
  let productoNuevo = {
    title: req.body.title,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
  };

  let id = productos.length + 1;
  let nuevoObjeto = { ...productoNuevo, id };
  productos.push(nuevoObjeto);

  res.status(200).json({ msg: "Agregado!", datos: productos });
  res.end();
});

//PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
routerProductos.put("/:id", function (req, res) {
  const valueID = req.params.id;
  const index = productos.findIndex((x) => x.id === parseInt(valueID));

  let productosActualizar = {
    title: req.body.title,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
  };

  if (index == -1) {
    res.send({ code: 400, failed: "Producto no Encontrado" });
  } else {
    for (let key of Object.keys(productosActualizar)) {
      productosActualizar[key]
        ? (productos[index][key] = productosActualizar[key])
        : productos[index][key];
    }
    res.send({
      code: 200,
      mensaje: "Producto Actualizado",
      data: productos[index],
    });
  }
});

//DELETE '/api/productos/:id' -> elimina un producto según su id.
routerProductos.delete("/:id", function (req, res) {
  const valueID = req.params.id;
  const index = productos.findIndex((x) => x.id === parseInt(valueID));

  if (index == -1) {
    res.send({ code: 400, failed: "Producto no Encontrado" });
  } else {
    productos.splice(index, 1);
    res.send({ code: 200, mensaje: "Producto Eliminado" });
  }
});

module.exports = routerProductos;
