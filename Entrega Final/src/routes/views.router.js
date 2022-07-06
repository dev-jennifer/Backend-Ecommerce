const express = require('express');
const router = express.Router();
 
class RouterViews {
  constructor() {
    this.view = new RequestViews();
  }

  start() {
    router.get('/', this.view.indexPage);
    router.get('/productos/nuevo', this.view.newProduct);
    router.get('/productos', this.view.getProductAll);
    router.get('/productos/:id', this.view.getProductId);
    router.get('/productos/edit/:id', this.view.editProductId);
    router.get('/*', this.view.notFound);
  

    return router;
  }
}
module.exports = RouterViews;
