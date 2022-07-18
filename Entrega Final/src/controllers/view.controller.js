const ProductsController = require('./products.controller');
const CartController = require('./cart.controller');
const config = require('../utils/config');
const APICustom = require('../classes/Error/customError');

class RequestViews {
  constructor() {
    this.controladorProductos = new ProductsController();
    this.controladorCarrito = new CartController();
    this.message = new APICustom();
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
    const productos = await this.controladorProductos.productsAll();
    const categorias = await this.controladorProductos.categories();
    try {
      res.render('products', {
        productos: productos,
        cat: categorias,
        title: 'Productos',
      });
    } catch (err) {
      this.message.errorNotFound(err, `Producto no encontrado`);
    }
  };

  getCategoryId = async (req, res, next) => {
    const productos = await this.controladorProductos.productCategory(
      req.params.id
    );
    const categorias = await this.controladorProductos.categories();

    try {
      res.render('products', { productos: productos, cat: categorias });
    } catch (err) {
      this.message.errorNotFound(err, `Categoria no encontrado`);
    }
  };

  getProductId = (req, res, next) => {
    this.controladorProductos
      .productId(req.params.id)
      .then((product) => {
        res.render('productDetail', { producto: product });
      })
      .catch((err) => {
        this.message.errorNotFound(err, `Producto no encontrado`);
      });
  };

  editProductId = (req, res, next) => {
    this.controladorProductos
      .productId(req.params.id)
      .then((product) => {
        res.render('editProduct', { producto: product });
      })
      .catch((err) => {
        this.message.errorNotFound(err, `Producto no encontrado`);
      });
  };

  getCartView = async (req, res, next) => {
    let cart;
    let cartItem;
    const id = req.params.id;
    const carrito = await this.controladorCarrito.getItemsInCart(id);
    if (carrito) {
      cartItem = carrito.items.map(
        (item) =>
          (cart = {
            nombre: item.nombre,
            foto: item.foto,
            precio: item.precio,
            quantity: item.cantidad,
            subtotal: item.cantidad * item.precio,
            itemId: item.itemId,
          })
      );
    } else {
      cartItem = [];
    }
    res.render('carrito', {
      producto: cartItem,
    });
  };
  getCartEmpty = async (req, res) => {
    const cartItem = [];
    res.render('carrito', {
      producto: cartItem,
    });
  };
  getOrderView = async (req, res) => {
    try {
      let cart;
      let cartItem;
      const id = req.params.id;
      const carrito = await this.controladorCarrito.getItemsInCart(id);

      res.render('order', { title: 'Orden', producto: carrito.items });
    } catch (error) {
      this.message.errorInternalServer(
        err,
        `Hubo un problema en generar orden`
      );
    }
  };

  serverInfo = (req, res) => {
    try {
      let argumentos = [];
      process.argv.forEach((val, index) => {
        argumentos += `${index}: ${val}`;
      });

      const folder = process.cwd();
      const versionNode = process.version;
      const processId = process.version;
      const so = process.platform;
      const memory = process.memoryUsage().rss;
      const memoryRss = Math.round((memory / 1024 / 1024) * 100) / 100;
      const pid = process.pid;

      res.render('info', {
        title: 'Informacion',
        argumentos: argumentos,
        path: pid,
        so: so,
        processId: processId,
        versionNode: versionNode,
        folder: folder,
        memory: memoryRss,
        config: config,
      });
    } catch (error) {
      this.message.errorInternalServer(error, 'Error al visualizar datos');
    }
  };
}
module.exports = RequestViews;
