const express = require("express");
const routerCarrito = express.Router();

const Carrito = require("../public/modulos/Carrito.js");
const CarritoClass = new Carrito();

routerCarrito.post('/', async (req, res)=>{
    const body = req.body;

     try {
      await CarritoClass.guardar(JSON.stringify({body}));
 
    } catch (error) {
      console.log("error", error);
    }
 
})

 
routerCarrito.get('/', (req, res)=>{
    res.status(200).json(carrito);
})


module.exports = routerCarrito;
