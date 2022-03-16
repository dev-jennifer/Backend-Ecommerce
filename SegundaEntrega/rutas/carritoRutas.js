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
      buyerID: session_id,
      items: [],
      total: 0,
      timestamps: new Date(),
    };
    const resultado = await objCarrito.guardar(newCarrito);
    res.status(200).send({ msg: "Carrito Creado", data: newCarrito });
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

// routerCarrito.post(`/:id/productos/:id_prod`, async (req, res) => {
//   const idBuyer = req.params.id;
//   const id_prod = req.params.id_prod;

//   try {
//     await objProd
//       .mostrarId(id_prod)
//       .then(async (cartProduct) => {
//         await objCarrito.actualizarCart(idBuyer, cartProduct);
//       })
//       .catch((error) => {
//         console.error(error);
//       })
//       .finally(() => {
//         res.json({
//           mensaje: `Se ha agregado ProductoId ${id_prod} al carrito`,
//         });
//       });
//   } catch (error) {
//     console.log("error", error);
//   }
// });

//add cart
routerCarrito.post(`/:id/productos/:id_prod`, async (req, res) => {
  const idBuyer = req.params.id;
  const itemId = req.params.id_prod;
  const cantidad = 1;

  try {
    const cart = await objCarrito.mostrarBuyer(idBuyer);
    const item = await objProd.mostrarId(itemId);

    if (!item) {
      res.status(404).send({ message: "No se encontro item" });
      return;
    }
    const precio = item.precioProducto;
    const nombre = item.nombreProducto;
    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
      //check if product exists or not

      if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.cantidad += cantidad;

        cart.total = cart.items.reduce((acc, curr) => {
          return acc + curr.cantidad * curr.precio;
        }, 0);

        cart.items[itemIndex] = product;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.items.push({ itemId, nombre, cantidad, precio });
        cart.total = cart.items.reduce((acc, curr) => {
          return acc + curr.cantidad * curr.precio;
        }, 0);

        await cart.save();
        res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        idBuyer,
        items: [{ itemId, nombre, cantidad, precio }],
        total: cantidad * precio,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Algo fue mal");
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
