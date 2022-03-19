import express from "express";
const routerCarrito = express.Router();
import uuidv1 from "uuidv1";
let session_id = uuidv1();
import { objProd } from "../rutas/productosRutas.js";

// import CarritoDAO from "../src/DAOs/Carrito.dao.mongo.js";
import CarritoDAO from "../src/DAOs/Carrito.dao.firebase.js";

const objCarrito = new CarritoDAO();

routerCarrito.post("/", async (req, res) => {
  try {
    

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

//add cart
routerCarrito.post(`/:id/productos/:id_prod`, async (req, res) => {
  const idBuyer = req.params.id;
  const itemId = req.params.id_prod;
  const cantidad = 1;

  try {
    const cart = await objCarrito.mostrarBuyer(idBuyer);
    console.log(cart)
    const item = await objProd.mostrarId(itemId);

    if (!item) {
      res.status(404).send({ message: "No se encontro item" });
      return;
    }
    const precio = item.precioProducto;
    const nombre = item.nombreProducto;
    //If cart already exists for user,
    if (cart) {
      console.log(cart.items)
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
      const newCart = await objCarrito.guardar ({
        buyerID: session_id,
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

routerCarrito.get("/:id/productos", async (req, res) => {
  const idBuyer = req.params.id;

  try {
    const carrito = await objCarrito.mostrarBuyer(idBuyer);
    return res.status(201).send(carrito);
  } catch (error) {
    console.log(error);
    res.status(500).send("Algo fue mal");
  }
});


routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
  const idBuyer = req.params.id;
  const itemId = req.params.id_prod;

  try {
    let carrito = await objCarrito.mostrarBuyer(idBuyer);
    const itemIndex = carrito.items.findIndex((item) => item.itemId == itemId);

    if (itemIndex > -1) {
      let item = carrito.items[itemIndex];
      carrito.total -= item.cantidad * item.precio;
      if (carrito.total < 0) {
        carrito.total = 0;
      }
      carrito.items.splice(itemIndex, 1);
      carrito.total = carrito.items.reduce((acc, curr) => {
        return acc + curr.cantidad * curr.precio;
      }, 0);

      carrito = await carrito.save();

      res.status(200).send(carrito);
    } else {
      res.status(404).send("No se encontro el item");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});
export default routerCarrito;
