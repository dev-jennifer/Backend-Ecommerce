const express = require('express'),
  routerOrder = express.Router(),
  OrderController = require('../controllers/order.controller');

routerOrder.get('/gracias', OrderController.renderThanks);
routerOrder.get('/:id', OrderController.getCartOrder);
routerOrder.post('/:id', OrderController.postOrder);
module.exports = routerOrder;
