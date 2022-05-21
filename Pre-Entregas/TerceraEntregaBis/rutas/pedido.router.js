const express = require('express'),
  session = require('express-session'),
  { newOrderEmail } = require('../notificaciones/emails/Order/newOrder'),
  routerPedido = express.Router(),
  { objCarrito } = require('./carrito.router'),
  PedidoDAO = require('../src/DAOs/Pedido.dao.mongo'),
  objPedido = new PedidoDAO();

function isAuthenticatedUser(req, res, next) {
  req?.isAuthenticated ? console.log(req.isAuthenticated) : null;
}

routerPedido.get('/:idCart', async (req, res) => {
  const idCart = req.params.id;
  const cart = await objCarrito.mostrarId('BuyerID', idCart);

  // isAuthenticatedUser?console.log(isAuthenticatedUser()):""

  res.render('order', { producto: cart.items });
});

 
routerPedido.get('/gracias', async (req, res) => {
  console.log('OK');
  res.render('gracias');
});
routerPedido.post('/:id', async (req, res, done) => {
  const idCart = req.params.id;
  const body = req.body;

  try {
    const cart = await objCarrito.mostrarId('BuyerID', idCart);
    console.log('CART', cart.items);
    const newOrder = {
      buyerID: body.email,
      items: cart.items,
      total: cart.total,
      timestamps: new Date(),
    };

     await objPedido
       .guardar(newOrder)

       .then((result) => newOrderEmail(result ))
       .catch((err) => console.log('ERROR', err));
 
  } catch (error) {
    res.json({
      estado: false,
      mensaje: 'error',
    });
  }
});

module.exports = routerPedido;
