const express = require("express");
const res = require("express/lib/response");
const routerProductos = express.Router();

const Productos = require("../public/modulos/Productos.js");
const ProductClass = new Productos();

let admin = true;


  routerProductos.get("/nuevo", function (req, res) {
    if (admin == true) {
    res.render("nuevoProducto")
  } else {
    res.json({
      error: -1,
      descripcion: `ruta ${"/"} método POST no autorizado`,
    });
    console.log("error autorizacion")}
  })



routerProductos.get("/", (req, res) => {
  try {
    let data = { productos: ProductClass.getAll() };
    res.render("productos", data);
  } catch (error) {
    res.send({
      code: 400,
      failed: "Error",
    });
  }
});

routerProductos.get("/:id?", async (req, res) => {
  const id = req.params.id;
  try {
    const seleccion = await ProductClass.getById(parseInt(id));
    console.log(seleccion);
    res.render("productoDetalle", {
      producto: seleccion,
      error: false,
    });
  } catch (error) {
    console.log("error", error);
    res.render("productoDetalle", {
      error: true,
      mensaje: "No se encuentra el producto",
    });
  }
});

routerProductos.post("/", async (req, res) => {
  if (admin == true) {
    const body = req.body;
    try {
      await ProductClass.save(body);
      res.redirect("/api/productos/");
    } catch (error) {
      console.log("error", error);
    }
  } else {
    res.json({
      error: -1,
      descripcion: `ruta ${"/"} método POST no autorizado`,
    });
  }
});

//DELETE  '/:id' - Borra un producto por su id (disponible para administradores)

routerProductos.delete("/:id", async (req, res) => {
  if (admin == true) {
    const valueID = req.params.id;
    try {
      const productoEliminar = await ProductClass.deleteById(parseInt(valueID));
      if (!productoEliminar) {
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
  } else {
    res.json({
      error: -1,
      descripcion: `ruta ${"/:id"} método delete no autorizado`,
    });
    console.log("Error");
  }
});

routerProductos.get("/edit/:id", async (req, res) => {
  if (admin == true) {
    const id = req.params.id;
    try {
      let data = { producto: ProductClass.getById(parseInt(id)) };
      res.render("editProduct", data);
    } catch (error) {
      res.send({
        code: 400,
        failed: "Error",
      });
    }
  } else {
    res.json({
      error: -1,
      descripcion: `ruta ${"/"} método POST no autorizado`,
    });
    console.log("Error");
  }
});

//PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.

routerProductos.put("/:id", async (req, res) => {
  if (admin == true) {
    const id = req.params.id;
    const body = req.body;

    try {
      const prodModificar = await ProductClass.actualizarDato(id, body);
      res.json({
        mensaje: "Producto actualizado",
      });
    } catch (error) {
      res.json({
        estado: false,
        mensaje: "Producto falla",
      });
    }
  } else {
    res.json({
      error: -1,
      descripcion: `ruta ${"/"} método POST no autorizado`,
    });
    console.log("Error");
  }
});

module.exports = routerProductos;
