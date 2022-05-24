const OrderDAOMongoDB = require('../services/orderDAOMongo'),
  msgSend = require('../../notificaciones/config/msjConfig'),
  UserDAO =require("../controllers/user.controller")
  
const OrderDAO = new OrderDAOMongoDB();

//objCarrito

const OrderController = {
renderThanks: (req, res) => {
    res.render('gracias');
},
getCart:async (req, res) => {
  const idCart = req.params.id;
  const cart = await objCarrito.mostrarId('BuyerID', idCart);
  res.render('order', { producto: cart.items });
},
postCart:async (req, res, done) => {
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

    await OrderDAO.guardar(newOrder)

      .then((order) => {
        newOrderEmail(order);
        UserDAO.mostrarId(newOrder.buyerID).then((userId) => {
          msgSend(userId.phone, order);
        });
      })
      .then(localStorage.setItem('my_token', ''))
      .finally(res.redirect('/'))
      .catch((err) => console.error('ERROR', err));


  } catch (error) {
    res.json({
      estado: false,
      mensaje: 'error',
    });
  }
}

};

module.exports = OrderController;
