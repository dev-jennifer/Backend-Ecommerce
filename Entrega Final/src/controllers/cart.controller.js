const CartDTO = require('../classes/Cart/CartDTO.class');
const CartDAOBase = require('../models/DAOs/cart');
const CartDAOFactory = require('../classes/Cart/CartDAOFactory.class'),
  ProductDAOFactory = require('../classes/Products/ProductDAOFactory.class'),
  logger = require('../utils/loggers');
// uuidv1 = require('uuidv1'),
// session_id = uuidv1();

class CartController {
  constructor() {
    this.ProductsDAO = ProductDAOFactory.get();
    this.cartDAO = CartDAOFactory.get();
    this.funciones = new CartDAOBase();
  }
  ///view///
  getItemsInCart = async (id) => {
    try {
      let cart = await this.cartDAO.mostrarId(id);

      return cart;
    } catch {
      console.log('Error');
    }
  };

  postCart = async (req, res) => {
    try {
      const items = [];
      const buyerID = '';
      const total = 0;
      const timestamps = new Date().toLocaleString();
      const shippingAddress = '';

      const carritoGuardado = new CartDTO(
        shippingAddress,
        items,
        buyerID,
        total,
        timestamps
      );
      const cart = await this.cartDAO.guardar(carritoGuardado);
      res.json({
        cart: cart,
      });
      console.log('CART original', cart);
    } catch (error) {
      logger.error('Error al guardar carrito', error);
      res.status(400).send('Status: Error al guardar carrito');
    }
  };

  getCart = async (req, res) => {
    const idCart = req.params.id;
    let list;
    try {
      const carritoCompleto = await this.cartDAO.mostrarId(idCart);

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
      res.status(200).json({ producto: list, cartID: idCart });
      // res.render('carrito', {
      //   producto: list,
      //   cartID: idCart,
      //   error: false,
      // });
    } catch (error) {
      logger.error('Error al obtener al carrito', error);
      res.status(400).send('Status: Error al obtener al  carrito');
      res.render('carrito', {
        producto: [],
        error: true,
      });
    }
  };

  postProductCart = async (req, res) => {
    const idCart = req.params.id,
      itemId = req.params.id_prod,
      cantidad = 1;

    try {
      let cart = await this.cartDAO.mostrarId(idCart);
      let item = await this.ProductsDAO.mostrarId(itemId);

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

        cart.items[itemIndex] = product;
      } else {
        cart.items.push({ itemId, nombre, cantidad, precio, foto });
      }

      cart.total = cart.items.reduce((acc, curr) => {
        return acc + curr.cantidad * curr.precio;
      }, 0);

      await this.cartDAO.actualizar(idCart, cart);

      res.status(200).send(cart);
    } catch (error) {
      logger.error('Error al agregar al carrito', error);
      res.status(400).send('Status: Error al agregar al  carrito');
    }
  };

  editCart = async (req, res) => {
    console.log('AQUI');
    const idCart = req.params.id;
    const body = req.body;
    console.log('idCart', idCart);
        console.log('body', body);
    try {
      let cart = await this.cartDAO.mostrarId(idCart);
 
      cart.buyerID = body.email;
      cart.shippingAddress = body.address;
      console.log('CART', cart);
       await this.cartDAO.actualizar(id, cart);
    } catch {
      res.status(400).send('Status: No se ha podido actualizar');
    }
  };

  getCartOrder = async (id) => {
    try {
      const cartComplete = await this.cartDAO.mostrarId(id);

      return cartComplete;
    } catch (error) {
      logger.error('Error al obtener orden del carrito', error);
      res.status(400).send('Status: rror al obtener orden del carrito');
    }
  };
  deleteCart = async (req, res) => {
    const idCart = req.params.id;

    try {
      let carrito = await this.cartDAO.mostrarId(idCart);

      carrito.items = [];
      carrito.total = 0;
      const carritoVacio = await this.cartDAO.actualizar(idCart, carrito);

      res.status(200).send(carritoVacio);
    } catch (error) {
      logger.error('Error al borrar carrito', error);
      res.status(400).send('Status: Error al borrar carrito');
    }
  };

  deleteItemCart = async (req, res) => {
    const idCart = req.params.id,
      itemId = req.params.id_prod;

    try {
      let carrito = await this.getItemsInCart(idCart);
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

        await this.cartDAO.actualizar(idCart, carrito);
        res.status(200).send(carrito);
      } else {
        res.status(404).send('No se encontro el item');
      }
    } catch (error) {
      logger.error('Error al borrar item del carrito', error);
      res.status(400).send('Status: error al borrar item  del carrito');
    }
  };
}

module.exports = CartController;
