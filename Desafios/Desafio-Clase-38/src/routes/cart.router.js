const express = require('express'),
  routerCart = express.Router(),
  CartController = require('../controllers/cart.controller');

routerCart.post('/', CartController.postCart);
routerCart.delete('/:id', CartController.deleteCart);
routerCart.post(`/:id/productos/:id_prod`, CartController.postProductCart);
routerCart.get('/:id/productos', CartController.getCart);
routerCart.delete('/:id/productos/:id_prod', CartController.deleteItemCart);

module.exports = routerCart;
