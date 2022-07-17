const express = require('express');
const router = express.Router();
const RequestViews = require('../controllers/view.controller');
const {isAdmin} = require('../passport/support');

class RouterViews {
  constructor() {
    this.view = new RequestViews();
  }

  start() {
    router.get('/', this.view.indexPage);
  //  router.get('/chat', this.view.chatPage);
    router.get('/productos/nuevo', isAdmin, this.view.newProduct);
    router.get('/productos', this.view.getProductAll);
    router.get('/productos/:id', this.view.getProductId);
    router.get('/productos/edit/:id', isAdmin, this.view.editProductId);
    router.get('/productos/categoria/:id', this.view.getCategoryId);
    router.get('/carrito/:id', this.view.getCartView);
    router.get('/pedido/:id', this.view.getOrderView);
    router.get('/serverInfo', this.view.serverInfo);
    
   

    return router;
  }
}
module.exports = RouterViews;
