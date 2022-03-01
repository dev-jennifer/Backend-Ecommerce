// const { options } = require("../src/utils/options");
const fs = require("fs");
module.exports = class Carrito {
  constructor() {
    this.ruta = "./data/carrito.txt";
  }

  getById(idCart) {
    const cart = this.getAll();
    let index = cart.findIndex((x) => x.BuyerID === idCart);

    let carrito=[]

    if (index != -1) {
      carrito = cart[index]
    }
    return carrito;
  }
  getAll() {
    let data;
    try {
      let jsonData = fs.readFileSync(this.ruta, "utf-8");
      data = JSON.parse(jsonData);
    } catch (error) {
      data = [];
    }
    return data;
  }
  crearCarrito() {
    let contenido = this.getAll();
    let ShoppingCart;
    let fecha = new Date().toDateString();

    console.log(contenido);
    if (contenido != "") {
      ShoppingCart = {
        BuyerID: contenido.length + 1,
        Fecha: fecha,
        Productos: [],
      };
    } else {
      ShoppingCart = {
        BuyerID: 1,
        Fecha: fecha,
        Productos: [],
      };
    }
    contenido.push(ShoppingCart);

    fs.writeFile(this.ruta, JSON.stringify(contenido, null, 2), (error) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log("Nuevo ID: " + ShoppingCart.BuyerID);
      }
    });
    return ShoppingCart.BuyerID;
  }

  save(idCart, ProductoAgregado) {
    let fecha = new Date().toDateString();

    let newItemObj = {
      nombreProducto: ProductoAgregado.nombreProducto,
      descripcion: ProductoAgregado.descripcion,
      fotoProducto: ProductoAgregado.fotoProducto,
      codigo: ProductoAgregado.codigo,
      precioProducto: ProductoAgregado.precioProducto,
      stock: ProductoAgregado.stock,
      idProducto: ProductoAgregado.id,
      productDate: fecha,
      Quantity: 1,
    };

    let cart = this.getAll();
    let existe = false;
    let index = cart.findIndex((x) => x.BuyerID === idCart);

    if (index != -1) {
      for (let i = 0; i < cart[index].Productos.length; i++) {
        if (
          cart[index].Productos[i].idProducto == newItemObj.idProducto &&
          cart[index].Productos[i].productDate == newItemObj.productDate
        ) {
          cart[index].Productos[i].Quantity += newItemObj.Quantity;
          existe = true;
        }
      }
      if (!existe) {
        cart[index].Productos.push(newItemObj);
      }
    }

    fs.writeFile(this.ruta, JSON.stringify(cart, null, 2), (error) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log(cart);
      }
    });
    return cart[index];
  }

  deleteByIdCart(idCart) {
    const cart = this.getAll();
    const index = cart.findIndex((x) => x.BuyerID === parseInt(idCart));
     console.log("INDEX",index)
    let borrado = false;
    if (index != -1) {
      cart[index].Productos=[]
      borrado = true;
      console.log(cart)
      fs.writeFile(
        this.ruta,
        JSON.stringify(cart, null, 2),
        (error) => {
          if (error) {
            console.log("Error");
          }
        }
      );
    }
    return borrado;
  }

  deleteById(idCart, idProducto) {
    const cart = this.getAll();
    const index = cart.findIndex((x) => x.BuyerID === idCart);
  
    let borrado = false;
    if (index != -1) {
 
      const prodSeleccionado = cart[index].Productos.findIndex((x) => x.idProducto === idProducto);
      cart[index].Productos.splice(prodSeleccionado, 1);
      borrado = true;
 
      fs.writeFile(
        this.ruta,
        JSON.stringify(cart, null, 2),
        (error) => {
          if (error) {
            console.log("Error");
          }
        }
      );
    }
    return borrado;
  }
};


