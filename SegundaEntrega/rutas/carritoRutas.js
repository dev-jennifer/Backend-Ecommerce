import express from "express";
const routerCarrito = express.Router();
import CarritoDAO from "../src/DAOs/carrito.dao.js";
import { objProd } from "../rutas/productosRutas.js";

const objCarrito = new CarritoDAO();

//nro de carrito
import uuidv1 from "uuidv1";

routerCarrito.post("/", async (req, res) => {
  try {
    let session_id = uuidv1();

    const newCarrito = {
      BuyerID: session_id,
      Fecha: new Date(),
      Productos: "",
    };
    const resultado = await objCarrito.guardar(newCarrito);

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
  const idCart = req.params.id;

  try {
    const estado = await objCarrito.eliminar(idCart);

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

routerCarrito.post(`/:id/productos/:id_prod`, async (req, res) => {
  const idCart = req.params.id;
  const id_prod = req.params.id_prod;

  console.log("cart", idCart);
  console.log("productos", id_prod);
  try {
    await objProd.mostrarId(id_prod).then((res) => {
        objCarrito.actualizarCart(idCart, res);
    });
  } catch (error) {
    console.log("error", error);
  }
});

// routerCarrito.get("/:id/productos", async (req, res) => {
//   const id = req.params.id;

//   try {
//     const carrito = objCarrito.getById(parseInt(id));
//     let list = carrito.Productos.map((item) => {
//       return {
//         nombreProducto: item.nombreProducto,
//         descripcion: item.descripcion,
//         fotoProducto: item.fotoProducto,
//         codigo: item.codigo,
//         precioProducto: item.precioProducto,
//         stock: item.stock,
//         quantity: item.Quantity,
//         subtotal: item.Quantity * item.precioProducto,
//         idProducto: item.idProducto,
//         idCarrito: id,
//       };
//     });

//     res.render("carrito", {
//       producto: list,
//       cartID: id,
//       error: false,
//     });
//   } catch (error) {
//     console.log("error", error);
//     res.render("carrito", {
//       producto: [],
//       error: true
//     });
//   }
// });

// routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
//   const idCart = parseInt(req.params.id);
//   const idProducto = parseInt(req.params.id_prod);

//   try {
//     const estado = await objCarrito.deleteById(idCart, idProducto);

//     if (estado == false) {
//       res.json({
//         estado: false,
//         mensaje: "No se puede eliminar",
//       });
//     } else {
//       res.json({
//         estado: true,
//         mensaje: "eliminado!",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

export default routerCarrito;
