const express = require("express");
const routerProductos = express.Router();

const Productos = require("../public/modulos/Productos.js");
const claseProducto = new Productos();

routerProductos.get("/nuevo", function (req, res) {
  res.render("nuevoProducto");
});

routerProductos.get("/", (req, res) => {
  try {
    let data = { productos: claseProducto.getAll() };
    console.log(data);
    res.render("productos", data);
  } catch (error) {
    res.send({
      code: 400,
      failed: "Error",
    });
  }
});

//GET: '/:id?' -
//Me permite listar todos los productos disponibles ó un producto por su id
//(disponible para usuarios y administradores)

routerProductos.get("/:id?", async (req, res) => {
  const id = req.params.id;
  try {
    const seleccion = await claseProducto.getById(parseInt(id));
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

//POST: '/' - Para incorporar productos al listado
//(disponible para administradores)

routerProductos.post("/", async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    await claseProducto.save(body);
    res.redirect("/productos");
  } catch (error) {
    console.log("error", error);
  }
});

//DELETE  '/:id' - Borra un producto por su id (disponible para administradores)

routerProductos.delete("/:id", async (req, res) =>{
 
  const valueID = req.params.id;
  console.log('id desde backend', valueID)

  try {
    const productoEliminar = await claseProducto.deleteById(parseInt(valueID))

    if (!productoEliminar) {
      res.json({
          estado: false,
          mensaje: 'No se puede eliminar'
      }) 
     } else {
        res.json({
            estado: true,
            mensaje: 'eliminado!'
        })
    }
  } catch (error) {
    console.log(error)
}
});

//PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
routerProductos.put("/:id", async (req, res) => {
  const valueID = req.params.id;
  const body = req.body;

  console.log(valueID)
  console.log('body', body)
  try {
    const prodModificar = await claseProducto.encontrarYactualizar(valueID, body) 
    console.log(prodModificar)
    res.json({
        estado: true,
        mensaje: 'Producto editado'
    })
} catch (error) {
    console.log(error)
    res.json({
        estado: false,
        mensaje: 'Producto falla'
    })
}
})
module.exports = routerProductos;
