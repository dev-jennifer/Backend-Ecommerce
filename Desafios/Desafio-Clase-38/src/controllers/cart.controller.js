const CartDAOMongoDB = require('../services/cartDAOMongo'),
  uuidv1 = require('uuidv1'),
  session_id = uuidv1();

const ProductsController = require('../controllers/products.controller');
const CartDAO = new CartDAOMongoDB();

const CartController = {
  postCart: async (req, res) => {
    try {
      const newCarrito = {
        buyerID: session_id,
        items: [],
        total: 0,
        timestamps: new Date(),
      };
      const resultado = await CartDAO.guardar(newCarrito);
      console.log('OK');
      res.status(200).send({ msg: 'Carrito Creado', data: newCarrito });
      return newCarrito;
    } catch (error) {
      res.json({
        estado: false,
        mensaje: 'error',
      });
    }
  },
  deleteCart: async (req, res) => {
    const idCart = req.params.id,
      condicion = 'buyerID';
    try {
      const estado = await CartDAO.eliminar(condicion, idCart);

      if (estado == false) {
        res.json({
          estado: false,
          mensaje: 'No se puede eliminar',
        });
      } else {
        res.json({
          estado: true,
          mensaje: 'eliminado!',
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  postProductCart: async (req, res) => {
    const idCart = req.params.id,
      itemId = req.params.id_prod,
      cantidad = 1;

    try {
      const item = await ProductsController.showID(itemId);
      const cart = await CartDAO.mostrarId('buyerID', idCart);

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
            id: item.id,
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
      console.log('CART', id);
      return cartComplete;
    } catch (error) {}
  },

  deleteItemCart: async (req, res) => {
    const idCart = req.params.id,
      itemId = req.params.id_prod,
      condicion = 'buyerID';

    try {
      let carrito = await CartDAO.mostrarId(condicion, idCart);

      const itemIndex = carrito.items.findIndex((item) => item.id == itemId);

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

        res.status(200).send(carrito);
      } else {
        res.status(404).send('No se encontro el item');
      }
    } catch (error) {
      console.log(error);
      res.status(400).send();
    }
  },
};

module.exports = CartController;
