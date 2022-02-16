const express = require("express");
const routerProductos = express.Router();
const methodOverride = require('method-override');
routerProductos.use(methodOverride('_method'));

const Productos = require("../Productos.js");
const archivo = new Productos()

routerProductos.get("/", (req, res) => {
  try {
    let data= {productos: archivo.getAll()}
    res.render('productos', data )
  } catch (error) {
    res.send({
      code: 400,
      failed: "Error",
    });

  }
});
routerProductos.get("/nuevo", function(req, res) {
  res.render('nuevoProducto');
});
//GET: '/:id?' - 
//Me permite listar todos los productos disponibles ó un producto por su id 
//(disponible para usuarios y administradores)

routerProductos.get("/:id?", function (req, res) {
  const valueID = req.params.id;
  try {
    let seleccion= archivo.getById(parseInt(valueID))
    res.render('productoDetalle',seleccion )
  } catch (error) {
    res.send({
      code: 400,
      failed: "Error",
    });
  }
});

//POST: '/' - Para incorporar productos al listado 
//(disponible para administradores)
routerProductos.post("/", (req, res) => {
  let productoNuevo = {
    nombreProducto: req.body.nombreProducto,
    descripcion: req.body.descripcion,
    codigo: req.body.codigo,
    fotoProducto: req.body.fotoProducto,
    precio: req.body.precio,
    stock: req.body.stock
  };
  archivo.save(productoNuevo)
});


//DELETE  '/:id' - Borra un producto por su id (disponible para administradores)

routerProductos.delete("/:id", function (req, res) {
  console.log("Borrar")
  const valueID = req.params.id;
  res.send(archivo.deleteById(parseInt(valueID)))
});

module.exports = routerProductos;


