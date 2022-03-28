const {options} = require("../src/utils/options");
const express = require("express");
const routerProductos = express.Router();

const Productos = require("../src/Productos.js");
const ProductClass = new Productos(options.mariaDB );

let admin = true;

routerProductos.get("/nuevo", function (req, res) {
  if (admin == true) {
    res.render("nuevoProducto");
    
  } else {
    res.json({
      error: -1,
      descripcion: `ruta ${"/"} método POST no autorizado`,
    });
    console.log("error autorizacion");
  }
});

routerProductos.get("/", (req, res) => {
  try {
    ProductClass.mostrarTodos().then((respuesta) => {
      console.table(respuesta);
      let data = { productos: respuesta };
      res.render("productos", data);
    });
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
    ProductClass.mostrarId(parseInt(id)).then((respuesta) => {
      res.render("productoDetalle", {
        producto: respuesta[0],
        error: false,
      });
      console.table( respuesta);
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
    ProductClass.guardar(body).then((result) => {
      try {
        res.redirect("/api/productos/");
        console.log(result);
      } catch (error) {
        console.log("error", error);
      }
    });
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
      ProductClass.eliminar(parseInt(valueID)).then(() => {
        res.redirect("/api/productos/");
        console.log("Registro Eliminado");
      });
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
      ProductClass.mostrarId(parseInt(id)).then((result) => {
      res.render("editProduct", result[0]);
      })
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
  }
});

//PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.

routerProductos.put("/:id", async (req, res) => {
  if (admin == true) {
    const id = req.params.id;
    const body = req.body;
 
    try {
      ProductClass.actualizar(id,body).then((result) => {
     res.json({
        mensaje: "Producto actualizado",
      });
    })
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
