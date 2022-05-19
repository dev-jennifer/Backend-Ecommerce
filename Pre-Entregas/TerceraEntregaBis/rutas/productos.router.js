const express =require("express");
const routerProductos = express.Router();
const ProductosDAO  =require( "../src/DAOs/productos.dao.mongo.js")

let admin = true;
const objProd = new ProductosDAO();

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

routerProductos.get("/", async (req, res) => {
  try {
    
    await objProd.mostrarTodos().then((respuesta) => {
 
      let data = { productos: respuesta };
      res.render("productos", data);
    });

  } catch (error) {
    console.log("error", error);
    res.send({
      code: 400,
      failed: "Error",
    });
  }
});

//NUEVO PRODUCTO
routerProductos.post("/", async (req, res) => {
  if (admin == true) {
    const body = req.body;
    await objProd.guardar(body).then((result) => {
      try {
        res.redirect("/api/productos/");
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
      await objProd.eliminar(valueID).then(() => {
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


routerProductos.get("/:id?", async (req, res) => {
  const id = req.params.id;
 
  try {
    await objProd.mostrarId(id).then((respuesta) => {
      res.render("productoDetalle", {
        producto: respuesta,
        error: false,
      });

    });
  } catch (error) {
    console.log("error", error);
    res.render("productoDetalle", {
      error: true,
      mensaje: "No se encuentra el producto",
    });
  }
});



routerProductos.get("/edit/:id", async (req, res) => {
  if (admin == true) {
    const id = req.params.id;
    try {
      await objProd.mostrarId(id).then((result) => {
      res.render("editProduct", result);
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
    const condicion = "id"
    try {
      await objProd.actualizar(condicion,id,body).then((result) => {
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


module.exports= {routerProductos,objProd};