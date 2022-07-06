const ProductsController = require('../controllers/products.controller');

class RequestViews {
  constructor() {
    this.controlador = new ProductsController();
  }

  indexPage = (req, res) => {
    res.status(200).render('index', { title: 'Inicio' });
  };
  notFound=(req,res)=>{
     res.status(400).json({
       msg: 'error : 404, descripcion: ruta  no implementada',
     });
  }
  newProduct = (req, res) => {
    res.render('addProduct', { title: 'Producto' });
  };
  getProductAll = (req, res, next) => {
    this.controlador
      .productsAll()
      .then((product) => {
        res.render('products', { productos: product });
      })
      .catch(next);
  };

  getProductId = (req, res, next) => {
    this.controlador
      .productId(req.params.id)
      .then((product) => {
        res.render('productDetail', { producto: product });
      })
      .catch(next);
  };

  editProductId = (req, res, next) => {
    this.controlador
      .productId(req.params.id)
      .then((product) => {
        res.render('editProduct', { producto: product });
      })
      .catch(next);
  };
}

module.exports = RequestViews;
