const ProductsController = require('./products.controller');

class RequestViews {
  constructor() {
    this.controlador = new ProductsController();
  }

  indexPage = (req, res) => {
    res.status(200).render('index', { title: 'Inicio' });
  };
  notFound = (req, res) => {
    res.status(400).json({
      msg: 'error : 404, descripcion: ruta  no implementada',
    });
  };
  newProduct = (req, res) => {
    res.render('addProduct', { title: 'Producto' });
  };
  getProductAll = async (req, res, next) => {
    const productos = await this.controlador.productsAll();
    const categorias = await this.controlador.categories();
    try {
      res.render('products', { productos: productos, cat: categorias, title:"Productos" });
    } catch {
      next;
    }
  };

  getCategoryId = async (req, res, next) => {
    const productos = await this.controlador.productCategory(req.params.id);
    const categorias = await this.controlador.categories();

    try {
      res.render('products', { productos: productos, cat: categorias });
    } catch {
      next;
    }
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
