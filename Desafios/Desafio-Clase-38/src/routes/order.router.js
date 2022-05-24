const express = require('express'),
  routerOrder = express.Router(),
  OrderController = require('../controllers/order.controller');

routerOrder.get('/gracias', OrderController.renderThanks);
routerOrder.get('/:idCart', OrderController.getCart);
routerOrder.post('/:id', OrderController.postCart);
module.exports = routerOrder;
