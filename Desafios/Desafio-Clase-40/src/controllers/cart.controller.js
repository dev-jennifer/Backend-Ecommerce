const { CartDAOMongoDB } = require('../services/DAOMongo'),
  { CartDAOFile } = require('../services/DAOFile'),
  { CartDAOMemory } = require('../services/DAOMemory'),
  ProductsController = require('../controllers/products.controller'),
  CustomError = require('../classes/CustomError.class'),
  uuidv1 = require('uuidv1'),
  session_id = uuidv1(),
  config = require('../utils/config');

let CartDAO = null;

switch (config.SRV.persistencia) {
  case 'mongodb':
    CartDAO = new CartDAOMongoDB();

    break;
  case 'file':
    CartDAO = new CartDAOFile();

    break;
  case 'memory':
    CartDAO = new CartDAOMemory();
    break;
  default:
    break;
}

const CartController = {
  postCart: async (req, res) => {
    try {
      const newCarrito = {
        buyerID: session_id,
        items: [],
        total: 0,
        timestamps: new Date(),
      };

      const cart = await CartDAO.guardar(newCarrito);
      res.json({
        cart: cart,
      });
    } catch (error) {
      new CustomError(500, 'Error al guardar carrito', error);
    }
  },

  deleteCart: async (req, res) => {
    const idCart = req.params.id,
      condicion = 'buyerID';
    try {
      let carrito = await CartDAO.mostrarId(condicion, idCart);

      carrito.items = [];
      carrito.total = 0;

      CartDAO.actualizar(condicion, idCart, carrito);
      res.status(200).send(carrito);
    } catch (error) {
      console.log(error);
    }
  },
  postProductCart: async (req, res) => {
    const idCart = req.params.id,
      itemId = req.params.id_prod,
      cantidad = 1;
   


    try {
      let item = await ProductsController.showID(itemId);
      let cart = await CartDAO.mostrarId('buyerID', idCart);

 
      const precio = item.precio,
        nombre = item.nombre,
        foto = item.foto;

      id = item._id;
      if (cart.items == undefined) {
        cart.items = [];
      }

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
     
      CartDAO.actualizar('buyerID', idCart, cart);

      res.status(200).send(cart);
    } catch (error) {
      console.log(error);
      res.status(500).send('Algo fue mal');
    }
  },

  getCart: async (req, res) => {
    const idCart = req.params.id;
    let list;
    try {
      const carritoCompleto = await CartDAO.mostrarId('buyerID', idCart);

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
      console.log('error', error);
      res.render('carrito', {
        producto: [],
        error: true,
      });
    }
  },
  getCartOrder: async (id) => {
    try {
      const cartComplete = await CartDAO.mostrarId('buyerID', id);

      return cartComplete;
    } catch (error) {}
  },

  deleteItemCart: async (req, res) => {
    const idCart = req.params.id,
      itemId = req.params.id_prod,
      condicion = 'buyerID';

    try {
      let carrito = await CartDAO.mostrarId(condicion, idCart);

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

        CartDAO.actualizar(condicion, idCart, carrito);

        //carrito = await carrito.save();

         res.status(200).send(cart);
      } else {
        res.status(404).send('No se encontro el item');
      }
    } catch (error) {

      res.status(400).send();
    }
  },
};

module.exports = CartController;
