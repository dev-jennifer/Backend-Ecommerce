const APICustom = require('../classes/Error/customError');
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
    this.message = new APICustom();
  }
  renderThanks = (req, res) => {
    res.render('gracias');
  };

  getOrderById = async (req, res) => {
    const id = req.params.id;
    try {
      const cart = await this.cart.getCartOrder(id);

      res.render('order', { title: 'Orden', producto: cart.items });
    } catch (error) {
      this.message.errorInternalServer(error, 'Error al guardar la orden');
    }
  };

  postOrder = async (req, res, done) => {
    const id = req.params.id;
    const body = req.body;

    const cart = await this.getCartOrder(id);

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
        this.message.errorInternalServer(err, 'Error al guardar la orden');
      });
  };
}

module.exports = OrderController;
