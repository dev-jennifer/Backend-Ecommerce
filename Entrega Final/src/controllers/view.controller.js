const ProductsController = require('./products.controller');
const CartController = require('./cart.controller');
class RequestViews {
  constructor() {
    this.controladorProductos = new ProductsController();
    this.controladorCarrito = new CartController();
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
    } catch {
      next;
    }
  };

  getCategoryId = async (req, res, next) => {
    const productos = await this.controladorProductos.productCategory(
      req.params.id
    );
    const categorias = await this.controladorProductos.categories();

    try {
      res.render('products', { productos: productos, cat: categorias });
    } catch {
      next;
    }
  };

  getProductId = (req, res, next) => {
    this.controladorProductos
      .productId(req.params.id)
      .then((product) => {
        res.render('productDetail', { producto: product });
      })
      .catch(next);
  };

  editProductId = (req, res, next) => {
    this.controladorProductos
      .productId(req.params.id)
      .then((product) => {
        res.render('editProduct', { producto: product });
      })
      .catch(next);
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

  getOrderView = async (req, res) => {
    let cart;
    let cartItem;
    const id = req.params.id;
    const carrito = await this.controladorCarrito.getItemsInCart(id);
   

    res.render('order', { title: 'Orden', producto: carrito.items });
  };
}
module.exports = RequestViews;
