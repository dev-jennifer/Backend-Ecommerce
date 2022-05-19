const express = require('express'),
	session = require('express-session');

const routerCarrito = express.Router();
const uuidv1 = require('uuidv1');
let session_id = uuidv1();
const { objProd } = require('./productos.router.js');

const CarritoDAO = require('../src/DAOs/Carrito.dao.mongo.js');
// import CarritoDAO from "../src/DAOs/Carrito.dao.firebase.js";
const objCarrito = new CarritoDAO();

routerCarrito.post('/', async (req, res) => {
	try {
		const newCarrito = {
			buyerID    : session_id,
			items      : [],
			total      : 0,
			timestamps : new Date()
		};
		const resultado = await objCarrito.guardar(newCarrito);

		res.status(200).send({ msg: 'Carrito Creado', data: newCarrito });
		return newCarrito;
	} catch (error) {
		res.json({
			estado  : false,
			mensaje : 'error'
		});
	}
});

routerCarrito.delete('/:id', async (req, res) => {
	const idCart = req.params.id;
	const condicion = 'buyerID';
	try {
		const estado = await objCarrito.eliminar(condicion,idCart);

		if (estado == false) {
			res.json({
				estado  : false,
				mensaje : 'No se puede eliminar'
			});
		} else {
			res.json({
				estado  : true,
				mensaje : 'eliminado!'
			});
		}
	} catch (error) {
		console.log(error);
	}
});

//add cart
routerCarrito.post(`/:id/productos/:id_prod`, async (req, res) => {
	const idCart = req.params.id;
	const itemId = req.params.id_prod;
	const cantidad = 1;

	try {
		const cart = await objCarrito.mostrarId('BuyerID', idCart);
		const item = await objProd.mostrarId('_id', itemId);

 
		const precio = item.precioProducto;
		const nombre = item.nombreProducto;
		const foto = item.fotoProducto;
		const id = item._id;
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
			cart.items.push({ itemId, nombre, cantidad, precio, foto, id });

			cart.total = cart.items.reduce((acc, curr) => {
				return acc + curr.cantidad * curr.precio;
			}, 0);
		}

		const condition = 'BuyerID';
		objCarrito.actualizar(condition, idCart, cart);

		res.status(200).send(cart);
	} catch (error) {
		console.log(error);
		res.status(500).send('Algo fue mal');
	}
});

routerCarrito.get('/:id/productos', async (req, res) => {
	const idCart = req.params.id;
	const condicion = 'buyerID';
	try {
		const carrito = await objCarrito.mostrarId(condicion, idCart);
    if(carrito){
		let list = carrito.items.map((item) => {
			return {
				nombreProducto : item.nombre,
				fotoProducto   : item.foto,
				precioProducto : item.precio,
				quantity       : item.cantidad,
				subtotal       : item.cantidad * item.precio,
				idProducto     : item._id
			};
		});
  }else{
    list=[]
  }
		res.render('carrito', {
			producto : list,
			cartID   : idCart,
			error    : false
		});
	} catch (error) {
		console.log('error', error);
		res.render('carrito', {
			producto : [],
			error    : true
		});
	}
});

routerCarrito.delete('/:id/productos/:id_prod', async (req, res) => {
	const idCart = req.params.id;
	const itemId = req.params.id_prod;
	const condicion = 'buyerID';

	try {
		let carrito = await objCarrito.mostrarId(condicion,idCart);
 

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

			objCarrito.actualizar(condicion, idCart, carrito);
			//carrito = await carrito.save();

			res.status(200).send(carrito);
		} else {
			res.status(404).send('No se encontro el item');
		}
	} catch (error) {
		console.log(error);
		res.status(400).send();
	}
});

module.exports = routerCarrito;
