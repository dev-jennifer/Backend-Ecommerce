const express = require("express");
const routerCarrito = express.Router();

const Carrito = require("../public/modulos/Carrito.js");
const CarritoClass = new Carrito();

const Productos = require("../public/modulos/Productos.js");
const ProductClass = new Productos();

routerCarrito.post("/", async (req, res) => {
  try {
    const resultado = await CarritoClass.crearCarrito();
    res.json({
      estado: true,
      id: resultado,
    });
  } catch (error) {
    res.json({
      estado: false,
      mensaje: "error",
    });
  }
});

routerCarrito.delete("/:id", async (req, res) => {
  const idCart = parseInt(req.params.id);

  try {
    const estado = await CarritoClass.deleteByIdCart(idCart);

    if (estado == false) {
      res.json({
        estado: false,
        mensaje: "No se puede eliminar",
      });
    } else {
      res.json({
        estado: true,
        mensaje: "eliminado!",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

routerCarrito.get("/:id/productos", async (req, res) => {
  const id = req.params.id;

  try {
    const carrito = CarritoClass.getById(parseInt(id));
    let list = carrito.Productos.map((item) => {
      return {
        nombreProducto: item.nombreProducto,
        descripcion: item.descripcion,
        fotoProducto: item.fotoProducto,
        codigo: item.codigo,
        precioProducto: item.precioProducto,
        stock: item.stock,
        quantity: item.Quantity,
        subtotal: item.Quantity * item.precioProducto,
        idProducto: item.idProducto,
        idCarrito: id,
      };
    });

    res.render("carrito", {
      producto: list,
      cartID: id,
      error: false,
    });
  } catch (error) {
    console.log("error", error);
    res.render("carrito", {
      producto: [],
      error: true
    });
  }
});

routerCarrito.post(`/:id/productos/:id_prod`, async (req, res) => {
  const idCart = parseInt(req.params.id);
  const id_prod = parseInt(req.params.id_prod);

  try {
    const ProductoAgregado = ProductClass.getById(id_prod);
    const seleccion = CarritoClass.save(idCart, ProductoAgregado);
  } catch (error) {
    console.log("error", error);
  }
});

routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
  const idCart = parseInt(req.params.id);
  const idProducto = parseInt(req.params.id_prod);
 
  try {
    const estado = await CarritoClass.deleteById(idCart, idProducto);

    if (estado == false) {
      res.json({
        estado: false,
        mensaje: "No se puede eliminar",
      });
    } else {
      res.json({
        estado: true,
        mensaje: "eliminado!",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = routerCarrito;
