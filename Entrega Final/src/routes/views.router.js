const express = require('express');
const router = express.Router();
const RequestViews = require('../controllers/view.controller');
const isAdmin=require("../passport/admin")

class RouterViews {
  constructor() {
    this.view = new RequestViews();
  }

  start() {
    router.get('/', this.view.indexPage);
    router.get('/productos/nuevo', isAdmin, this.view.newProduct);
    router.get('/productos', this.view.getProductAll);
    router.get('/productos/:id', this.view.getProductId);
    router.get('/productos/edit/:id', isAdmin, this.view.editProductId);
    router.get('/productos/categoria/:id', this.view.getCategoryId);

 //   router.get('/*', this.view.notFound);

    return router;
  }
}
module.exports = RouterViews;
