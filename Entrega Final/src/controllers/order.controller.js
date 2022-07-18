const msgSend = require('../notificaciones/config/msjConfig'),
  newOrderEmail = require('../notificaciones/emails/Order/newOrder'),
  UserController = require('../controllers/user.controller'),
  CartController = require('../controllers/cart.controller'),
  logger = require('../utils/loggers.js'),
  OrderFactory = require('../classes/Order/OrderFactory.class.js');

const OrdenDAO = OrderFactory.get();
class OrderController {
  constructor() {
    this.user = new UserController();
    this.cart = new CartController();
  }
  renderThanks = (req, res) => {
    res.render('gracias');
  };

  getCartOrder = async (req, res) => {
    const idCart = req.params.id;
    const cart = await this.cart.getCartOrder(idCart);

    res.render('order', { title: 'Orden', producto: cart.items });
  };

  postOrder = async (req, res, done) => {
    const idCart = req.params.id;
    const body = req.body;
    try {
      const cart = await this.cart.getCartOrder(idCart);
      const newOrder = {
        buyerID: body.email,
        name: body.name,
        phone: body.phone,
        items: cart.items,
        total: cart.total,
        timestamps: new Date(),
      };

      await OrdenDAO.guardar(newOrder)

        .then((order) => {
          newOrderEmail(order);

          this.user.existPassport(newOrder.buyerID).then(() => {
            //    msgSend(newOrder.phone, order);
          });
        })

        .catch((err) => {
          // const errorCustom = new CustomError(
          //   500,
          //   'Error al guardar orden',
          //   err
          // );
          logger.error(errorCustom);
        });
    } catch (error) {
      // const errorCustom = new CustomError(500, 'Error al guardar orden', error);
      logger.error(errorCustom);
    }
  };
}

module.exports = OrderController;
