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
  const valueID = req.params.id;
  try {
    const estado = await CarritoClass.deleteById(parseInt(valueID));
    console.log("Resultado", estado);

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

// routerCarrito.get("/", (req, res) => {
//   if (!localStorage.getItem("my_token")) {
//     const idCart = window.localStorage.getItem("my_token");
//     res.redirect(`/${idCart}/productos`);
//   } else {
//     res.render("carrito", {
//       error: true,
//     });
//   }
// });

routerCarrito.get("/:id/productos", async (req, res) => {
  const id = req.params.id;

  try {
    const carrito = CarritoClass.getById(parseInt(id))
    console.log(carrito.Productos)
    let list = carrito.Productos.map((item)=>{
      return  { nombreProducto: item.nombreProducto,
        descripcion: item.descripcion
       }
  });
  console.log(list)
    res.render("carrito", {
      producto: list,
      error: false,
    });
  } catch (error) {
    console.log("error", error);
  }
});

// routerCarrito.post("/:id", async (req, res) => {
//   const id = req.params.id;
//   const producto = req.body;

//   try {
//     const prodModificar = await CarritoClass.agregarProducto(id, producto);
//     res.json({
//       mensaje: "Producto actualizado",
//     });
//   } catch (error) {
//     res.json({
//       estado: false,
//       mensaje: "Producto falla",
//     });
//   }
// });

routerCarrito.post(`/:id/productos/:id_prod`, async (req, res) => {
  const idCart = parseInt(req.params.id);
  const id_prod = parseInt(req.params.id_prod);

  try {
    const ProductoAgregado = ProductClass.getById(id_prod);
    const seleccion = CarritoClass.save(idCart, ProductoAgregado);
    // console.log("Carrito View", seleccion);
  } catch (error) {
    console.log("error", error);
    // res.render("carrito", {
    //   error: true,
    //   mensaje: "No se encuentra el producto",
    // });
  }
});

routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
  const valueID = req.params.id;
  try {
    const estado = await CarritoClass.deleteById(parseInt(valueID));
    console.log("Resultado", estado);

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
// routerCarrito.get('/', (req, res)=>{
//   const idCart = parseInt(req.params.id)
//   const seleccion =  CarritoClass.getById(parseInt(id));
//   console.log(seleccion)
//   res.render("carrito", {
//     producto: seleccion,
//     error: false,
//   });
// })

module.exports = routerCarrito;
