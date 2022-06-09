const { OrderDAOMongoDB } = require('../services/DAOMongo'),
  { OrdenDAOFile } = require('../services/DAOFile'),
  { OrdenDAOMemory } = require('../services/DAOMemory'),
  msgSend = require('../../notificaciones/config/msjConfig'),
  newOrderEmail = require('../../notificaciones/emails/Order/newOrder'),
  UserController = require('../controllers/user.controller'),
  CartController = require('../controllers/cart.controller'),
  config = require('../utils/config');

let OrdenDAO = null;

switch (config.SRV.persistencia) {
  case 'mongodb':
    OrdenDAO = new OrderDAOMongoDB();

    break;
  case 'file':
    OrdenDAO = new OrdenDAOFile();

    break;
  case 'memory':
    OrdenDAO = new OrdenDAOMemory();
    break;
  default:
    break;
}

const OrderController = {
  renderThanks: (req, res) => {
    res.render('gracias');
  },

  getCartOrder: async (req, res) => {
    const idCart = req.params.id;
    const cart = await CartController.getCartOrder(idCart);

    console.log('CART1', cart);
    res.render('order', { title: 'Orden', producto: cart.items });
  },

  postOrder: async (req, res, done) => {
    const idCart = req.params.id;
    const body = req.body;
    // console.log('idCart ORDER', idCart);
    //  console.log('body', body);
    try {
      const cart = await CartController.getCartOrder(idCart);
      const newOrder = {
        buyerID: body.email,
        name: body.name,
        phone: body.phone,
        items: cart.items,
        total: cart.total,
        timestamps: new Date(),
      };
      console.log('cart,', cart);
      console.log('newOrder,', newOrder);

      await OrdenDAO.guardar(newOrder)

        .then((order) => {
          console.log('ORDEN', order);
          newOrderEmail(order);

          UserController.existPassport(newOrder.buyerID).then((userId) => {
            msgSend(newOrder.phone, order);
          });
        })

        .catch((err) => console.error('ERROR', err));
    } catch (error) {
      res.json({
        estado: false,
        mensaje: 'error',
      });
    }
  },
};

module.exports = OrderController;
