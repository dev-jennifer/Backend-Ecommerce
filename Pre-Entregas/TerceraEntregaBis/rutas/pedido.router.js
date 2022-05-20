const express = require('express'),
  session = require('express-session'),

 routerPedido = express.Router(),
 { objCarrito } = require('./carrito.router'),

 PedidoDAO = require('../src/DAOs/Pedido.dao.mongo'),
 objPedido = new PedidoDAO()

function isAuthenticatedUser(req, res, next) {
 req?.isAuthenticated?console.log(req.isAuthenticated):null
 }


 
routerPedido.get('/:idCart', async (req, res) => {

  const idCart = req.params.id;
  const cart = await objCarrito.mostrarId('BuyerID', idCart);

  // isAuthenticatedUser?console.log(isAuthenticatedUser()):""
 
 res.render('order', {producto: cart.items });
});

routerPedido.get('/gracias', async (req, res) => {
  console.log("OK")
  res.render('gracias');
});
routerPedido.post('/:id', async (req, res) => {
  const idCart = req.params.id;
 const body = req.body;
 
  try {
    const cart = await objCarrito.mostrarId('BuyerID', idCart);
    console.log("CART",cart.items)
    const newOrder = {
      buyerID: body.email,
      items: cart.items,
      total: cart.total,
      timestamps: new Date(),
    };

    console.log(newOrder)
    const resultado = await objPedido.guardar(newOrder);
   res.status(200).send(resultado);

  } catch (error) {
    res.json({
      estado: false,
      mensaje: 'error',
    });
  }
});

module.exports = routerPedido;
