import express from "express";
const routerCarrito = express.Router();
import uuidv1 from "uuidv1";
let session_id = uuidv1();
import { objProd } from "./productosRutas.js";


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
  const idCart = req.params.id;
  const itemId = req.params.id_prod;
  const cantidad = 1;

  try {
    const cart = await objCarrito.mostrarId(idCart);
    const item = await objProd.mostrarId(itemId);

    const precio = item.precioProducto;
    const nombre = item.nombreProducto;
    console.log("CARTITEMS" , cart.items)
    if (cart.items == undefined) {
      cart.items = [];
    }
    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
    console.log("itemIndex" ,itemIndex)
    if (itemIndex > -1) {
      let product = cart.items[itemIndex];
      console.log("product" ,product)

      product.cantidad += cantidad;
      
      cart.total = cart.items.reduce((acc, curr) => {
        return acc + curr.cantidad * curr.precio;
      }, 0);
      
      cart.items[itemIndex] = product;
    } else {
      cart.items.push({ itemId, nombre, cantidad, precio });
      console.log({ itemId, nombre, cantidad, precio });
      cart.total = cart.items.reduce((acc, curr) => {
        return acc + curr.cantidad * curr.precio;
      }, 0);   
    }
    objCarrito.actualizar(idCart, cart);
    console.log("cart",cart)
    res.status(200).send(cart);

  } catch (error) {
    console.log(error);
    res.status(500).send("Algo fue mal");
  }
});

routerCarrito.get("/:id/productos", async (req, res) => {
  const idCart = req.params.id;
  try {
    const carrito = await objCarrito.mostrarId(idCart);
    return res.status(201).send(carrito);
  } catch (error) {
    console.log(error);
    res.status(500).send("Algo fue mal");
  }
});

routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
  const idCart = req.params.id;
  const itemId = req.params.id_prod;

  try {
    let carrito = await objCarrito.mostrarId(idCart);
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
      objCarrito.actualizar(idCart, carrito);
      //carrito = await carrito.save();

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
