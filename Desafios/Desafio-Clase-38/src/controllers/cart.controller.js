const CartDAOMongoDB = require('../services/cartDAOMongo'),
  uuidv1 = require('uuidv1'),
  session_id = uuidv1()

const ProductsController=require("../controllers/products.controller")
  const CartDAO = new CartDAOMongoDB();

const CartController = {
postCart:async (req, res) => {
  try {
    const newCarrito = {
      buyerID: session_id,
      items: [],
      total: 0,
      timestamps: new Date(),
    };
    const resultado = await CartDAO.guardar(newCarrito);

    res.status(200).send({ msg: 'Carrito Creado', data: newCarrito });
    return newCarrito;
  } catch (error) {
    res.json({
      estado: false,
      mensaje: 'error',
    });
  }},
deleteCart:async (req, res) => {
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
  }},
postProductCart:  async (req, res) => {

  const idCart = req.params.id,
    itemId = req.params.id_prod,
    cantidad = 1;

  try {
  const item = await ProductsController.showID(itemId);
  const cart = await CartDAO.mostrarId('BuyerID', idCart); 

  console.log('item', item);
  console.log("CART",cart)
    const precio = item.precio,
      nombre = item.nombre,
      foto = item.foto,
      id = item._id;

    if (cart.items) {
      cart.items = [];
         console.log('INDEFINIDO');
    }
    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);
     console.log('itemIndex', itemIndex);
    if (itemIndex > -1) {
      let product = cart.items[itemIndex];

      product.cantidad += cantidad;

      cart.total = cart.items.reduce((acc, curr) => {
        return acc + curr.cantidad * curr.precio;
      }, 0);

      cart.items[itemIndex] = product;
    } else {
      cart.items.push({ itemId, nombre, cantidad, precio, foto, id });

      cart.total = cart.items.reduce((acc, curr) => {
        return acc + curr.cantidad * curr.precio;
      }, 0);
    }

    const conditionA = 'buyerID';
    //   console.log('CART ACTUALIZAR', cart);
    CartDAO.actualizar(conditionA, idCart, cart);

    res.status(200).send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send('Algo fue mal');
  }},

  getCart:async (req, res) => {
  const idCart = req.params.id,
    condicion = 'buyerID';
  let list;
  try {
    const carritoCompleto = await CartDAO.mostrarId(condicion, idCart);

    if (carritoCompleto) {
      list = carritoCompleto.items.map((item) => {
        return {
          nombre: item.nombre,
          foto: item.foto,
          precio: item.precio,
          quantity: item.cantidad,
          subtotal: item.cantidad * item.precio,
          _id: item._id,
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
  }},

  deleteItemCart:async (req, res) => {
  const idCart = req.params.id,
    itemId = req.params.id_prod,
    condicion = 'buyerID';

  try {
    let carrito = await CartDAO.mostrarId(condicion, idCart);

    const itemIndex = carrito.items.findIndex((item) => item._id == itemId);

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
  }}


}

module.exports = CartController;