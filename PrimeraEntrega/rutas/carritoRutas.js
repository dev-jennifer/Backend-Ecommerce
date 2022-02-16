const express = require('express');
const routerCarrito = express.Router();//Segmento de rutas 2

/*Personas*/
const carrito = [];
routerCarrito.get('/', (req, res)=>{
    res.status(200).json(carrito);
})

routerCarrito.post('/', (req, res)=>{
    console.log(req.body);
    carrito.push(req.body);
    res.status(200).json({msg: 'Agregado!', data:carrito});
})

module.exports = routerCarrito;
