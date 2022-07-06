const CartDTO = require('../classes/Cart/CartDTO.class');
const CartDAOBase = require('../models/DAOs/cart');
const CartDAOFactory = require('../classes/Cart/CartDAOFactory.class'),
  ProductsController = require('../controllers/products.controller'),
  CustomError = require('../classes/CustomError.class'),
  logger = require('../utils/loggers'),
  uuidv1 = require('uuidv1'),
  session_id = uuidv1();

class CartController extends ProductsController {
  constructor() {
    super();
    this.producto = new ProductsController();
    this.cartDAO = CartDAOFactory.get();
    this.funciones = new CartDAOBase();
  }
  postCart = async (req, res) => {
    try {
      let items = [];
      let buyerID = session_id;
      let total = 0;
      let timestamps = new Date().toLocaleString();
      let id = this.funciones.getNext_id(this.cartDAO);

      let carritoGuardado = CartDTO(id, items, buyerID, total, timestamps);

      const cart = await this.cartDAO.guardar(carritoGuardado);
      res.json({
        cart: cart,
      });
    } catch (error) {
      const errorCustom = new CustomError(
        500,
        'Error al guardar carrito',
        error
      );
      logger.error(errorCustom);
    }
  };
  deleteCart = async (req, res) => {
    const idCart = req.params.id,
      condicion = 'buyerID';
    try {
      let carrito = await this.cartDAO.mostrarId(condicion, idCart);

      carrito.items = [];
      carrito.total = 0;

      this.cartDAO.actualizar(condicion, idCart, carrito);
      res.status(200).send(carrito);
    } catch (error) {
      const errorCustom = new CustomError(
        500,
        'Error al borrar carrito',
        error
      );
      logger.error(errorCustom);
    }
  };
  postProductCart = async (req, res) => {
    const idCart = req.params.id,
      itemId = req.params.id_prod,
      cantidad = 1;
    console.log(`Cart ${idCart}, itemID ${itemId}`);

    try {
      let item = await this.producto.showID(itemId);
      console.log('ITEM_CART', item);
      let cart = await this.cartDAO.mostrarId('buyerID', idCart);

      if (cart.items == undefined) {
        cart.items = [];
      }
      const precio = item.precio,
        nombre = item.nombre,
        foto = item.foto;

      const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);

      if (itemIndex > -1) {
        let product = cart.items[itemIndex];

        product.cantidad += cantidad;

        cart.total = cart.items.reduce((acc, curr) => {
          return acc + curr.cantidad * curr.precio;
        }, 0);

        cart.items[itemIndex] = product;
      } else {
        cart.items.push({ itemId, nombre, cantidad, precio, foto });

        cart.total = cart.items.reduce((acc, curr) => {
          return acc + curr.cantidad * curr.precio;
        }, 0);
      }

      this.cartDAO.actualizar('buyerID', idCart, cart);

      res.status(200).send(cart);
    } catch (error) {
      const errorCustom = new CustomError(
        500,
        'Error al agregar producto al carrito',
        error
      );
      logger.error(errorCustom);
    }
  };

  getCart = async (req, res) => {
    const idCart = req.params.id;
    let list;
    try {
      const carritoCompleto = await this.cartDAO.mostrarId('buyerID', idCart);

      if (carritoCompleto) {
        list = carritoCompleto.items.map((item) => {
          return {
            nombre: item.nombre,
            foto: item.foto,
            precio: item.precio,
            quantity: item.cantidad,
            subtotal: item.cantidad * item.precio,
            itemId: item.itemId,
          };
        });
      } else {
        list = [];
      }
      res.render('carrito', {
        producto: list,
        cartID: idCart,
        error: false,
      });
    } catch (error) {
      const errorCustom = new CustomError(
        500,
        'Error al obtener carrito',
        error
      );
      logger.error(errorCustom);
      res.render('carrito', {
        producto: [],
        error: true,
      });
    }
  };
  getCartOrder = async (id) => {
    try {
      const cartComplete = await this.cartDAO.mostrarId('buyerID', id);

      return cartComplete;
    } catch (error) {
      const errorCustom = new CustomError(
        500,
        'Error al obtener orden del carrito',
        error
      );
      logger.error(errorCustom);
    }
  };

  deleteItemCart = async (req, res) => {
    const idCart = req.params.id,
      itemId = req.params.id_prod,
      condicion = 'buyerID';

    try {
      let carrito = await this.cartDAO.mostrarId(condicion, idCart);

      const itemIndex = carrito.items.findIndex(
        (item) => item.itemId == itemId
      );

      if (itemIndex > -1) {
        let item = carrito.items[itemIndex];
        carrito.total -= item.cantidad * item.precio;

        if (carrito.total < 0) {
          carrito.total = 0;
        }

        carrito.items.splice(itemIndex, 1);
        carrito.total = carrito.items.reduce((acc, curr) => {
          return acc + curr.cantidad * curr.precio;
        }, 0);

        this.cartDAO.actualizar(condicion, idCart, carrito);

        res.status(200).send(carrito);
      } else {
        res.status(404).send('No se encontro el item');
      }
    } catch (error) {
      const errorCustom = new CustomError(
        500,
        'Error al borrar item carrito',
        error
      );
      logger.error(errorCustom);
    }
  };
}

module.exports = CartController;
