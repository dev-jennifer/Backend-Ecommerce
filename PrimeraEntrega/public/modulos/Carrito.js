const fs = require("fs");
module.exports = class Carrito {
  constructor() {
    this.ruta = "./public/data/carrito.txt";
  }

  getById(numero) {
    const contenidoExistente = this.getAll();

    const index = contenidoExistente.findIndex((x) => x.id === numero);
    let mensaje = false;

    if (index != -1) {
      mensaje = contenidoExistente[index];
      console.log("Mensaje", mensaje);
    }
    return mensaje;
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
  
    console.log(contenido)
    if (contenido != "") {
      ShoppingCart = {
        BuyerID: contenido.length + 1,
        Fecha: fecha,
        Productos: [],
      };
      // id = contenido.length + 1;
      // let nuevoObjeto = { ...contenido, id };
      // contenido.push(nuevoObjeto);
    } else {
      ShoppingCart = {
        BuyerID: 1,
        Fecha: fecha,
        Productos: [],
      };
    }
    contenido.push(ShoppingCart);

    console.log("taño",contenido.length)
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

    console.log("index", index)
    if (index != -1) {
      for (let i = 0; i < cart[index].Productos.length; i++) {
        if (
          cart[index].Productos[i].idProducto == newItemObj.idProducto &&
          cart[index].Productos[i].productDate == newItemObj.productDate
        ) {
          cart[index].Productos[i].Quantity += newItemObj.Quantity;
          existe = true;
        }}
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
  }

  deleteById(numero) {
    const contenidoExistente = this.getAll();
    const index = contenidoExistente.findIndex((x) => x.id === numero);

    let borrado = false;
    if (index != -1) {
      contenidoExistente.splice(index, 1);
      borrado = true;

      fs.writeFile(
        this.ruta,
        JSON.stringify(contenidoExistente, null, 2),
        (error) => {
          if (error) {
            console.log("Error");
          }
        }
      );
    }
    return borrado;
  }

  // agregarProducto(idProducto) {
  //   const ExistenteID = this.getById(parseInt(idProducto));
  //   let nuevo = JSON.parse(JSON.stringify(idProducto));
  //   let productosActualizar = {
  //     nombreProducto: nuevo.nombreProducto,
  //     descripcion: nuevo.descripcion,
  //     fotoProducto: nuevo.fotoProducto,
  //     codigo: nuevo.codigo,
  //     precioProducto: nuevo.precioProducto,
  //     stock: nuevo.stock,
  //   };
  //   console.log("nombre", productosActualizar);
  //   let contenido = this.getAll();
  //   const index = contenido.findIndex(x => x.id === parseInt(id));

  //   if (index == -1) {
  //     res.send({ code: 400, failed: "Producto no Encontrado" });
  //   } else {
  //     for (let key of Object.keys(productosActualizar)) {
  //       productosActualizar[key]
  //         ? (contenido[index][key] = productosActualizar[key])
  //         : contenido[index][key];
  //     }
  //     fs.writeFile(this.ruta, JSON.stringify(contenido, null, 2), (error) => {
  //       if (error) {
  //         throw new Error(error);
  //       } else {
  //         console.log("actualizado");
  //       }
  //     });
  //   }
  // }
};
