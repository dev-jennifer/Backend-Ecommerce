const express =require("express");
const router = express.Router();
const ProductsController = require('../controllers/products.controller');

class RouterProduct {
  constructor() {
    this.controlador = new ProductsController();
  }

  start() {
    router.get('/nuevo', this.controlador.renderNewProduct);
    router.get('/', this.controlador.renderProducts);
    router.post('/', this.controlador.saveProducts);
    router.delete('/:id', this.controlador.deleteProduct);
    router.get('/:id', this.controlador.getProduct);
    router.get('/edit/:id', this.controlador.formEditProduct);
    router.put('/:id', this.controlador.editProduct);

    return router;
  }
}
module.exports = RouterProduct;