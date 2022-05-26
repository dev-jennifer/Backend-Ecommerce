const OrderDAOMongoDB = require('../services/orderDAOMongo'),
  msgSend = require('../../notificaciones/config/msjConfig'),
  newOrderEmail = require('../../notificaciones/emails/Order/newOrder'),
  UserController = require('../controllers/user.controller'),
  CartController = require('../controllers/cart.controller');
const OrderDAO = new OrderDAOMongoDB();
 

const OrderController = {
renderThanks: (req, res) => {
    res.render('gracias');
},

getCartOrder:async (req, res) => {
  const idCart = req.params.id;
  const cart = await CartController.getCartOrder(idCart);

  console.log(cart)
  res.render('order', { title:"Orden",producto: cart.items });
},
postOrder:async (req, res, done) => {

  const idCart = req.params.id;
  const body = req.body;
  console.log('idCart ORDER', idCart);
   console.log('body', body);
  try {
    const cart = await CartController.getCartOrder(idCart);
    const newOrder = {
      buyerID: body.email,
      name: body.name,
      items: cart.items,
      total: cart.total,
      timestamps: new Date(),
    };

    await OrderDAO.guardar(newOrder)

      .then((order) => {
        console.log("ORDEN", order)
        newOrderEmail(order);
        UserController.existPassport(newOrder.buyerID).then((userId) => {
          msgSend(userId.phone, order);
              console.log('userId.phone', userId.phone);
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
