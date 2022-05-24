const express = require('express'),
  session = require('express-session'),
  { newOrderEmail } = require('../../notificaciones/emails/Order/newOrder'),
  routerOrder = express.Router(),
  { objCarrito } = require('./cart.router'),
  { newUser } = require('./auth.router'),
  msgSend = require('../../notificaciones/config/msjConfig'),
  OrderDAOMongoDB = require('../services/orderDAOMongo'),
  objPedido = new OrderDAOMongoDB();


  routerOrder.get('/gracias', async (req, res) => {
    res.render('gracias');
  });

function isAuthenticatedUser(req, res, next) {
  req?.isAuthenticated ? console.log(req.isAuthenticated) : null;
}

routerOrder.get('/:idCart', async (req, res) => {
  const idCart = req.params.id;
  const cart = await objCarrito.mostrarId('BuyerID', idCart);

 

  res.render('order', { producto: cart.items });
});




routerOrder.post('/:id', async (req, res, done) => {
  const idCart = req.params.id;
  const body = req.body;

  try {
    const cart = await objCarrito.mostrarId('BuyerID', idCart);
 
    const newOrder = {
      buyerID: body.email,
      name: body.name,
      items: cart.items,
      total: cart.total,
      timestamps: new Date(),
    };

    await objPedido
      .guardar(newOrder)

      .then((order) => {
        newOrderEmail(order);
        newUser.mostrarId(newOrder.buyerID).then((userId) => {
          msgSend(userId.phone, order);
        });
      })
      .then(   localStorage.setItem('my_token', ""))
      .finally(res.redirect('/'))
      .catch((err) => console.error('ERROR', err));


  } catch (error) {
    res.json({
      estado: false,
      mensaje: 'error',
    });
  }
});

module.exports = routerOrder;
