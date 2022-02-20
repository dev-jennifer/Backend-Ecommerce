const fs = require("fs");
module.exports = class Carrito {
  constructor() {
    this.ruta = "./public/data/carrito.txt";
  }
  getById(numero) {
    const contenidoExistente = this.getAll();

    const index = contenidoExistente.findIndex(x => x.id === numero);
    let mensaje = false;

    if (index != -1) {
      mensaje = contenidoExistente[index];
      console.log("Mensaje", mensaje)
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
    console.log(contenido);
    let id;
    if (contenido == "") {
      id = contenido.length + 1;
      let nuevoObjeto = { ...contenido, id };
      contenido.push(nuevoObjeto);
    } else {
      id = 1;
      contenido = { id };
    }

    fs.writeFile(this.ruta, JSON.stringify(contenido, null, 2), (error) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log("Nuevo ID: " + id);
      }
    });
    return id;
  }

  save(idCart, ProductoAgregado) {
  
    let productosActualizar = {
      nombreProducto: ProductoAgregado.nombreProducto,
      descripcion: ProductoAgregado.descripcion,
      fotoProducto: ProductoAgregado.fotoProducto,
      codigo: ProductoAgregado.codigo,
      precioProducto: ProductoAgregado.precioProducto,
      stock: ProductoAgregado.stock,
      idProducto: ProductoAgregado.id,
    }
    console.log("ID Cart nr ", idCart);
 
    // let contenido = this.getAll();
    // let index = contenido.findIndex(x => x.id === idCart);

    // let agregoProducto = {...productosActualizar};

    // contenido.push(agregoProducto);
 
      let cartList = this.getAll();
      const cartListBak = [...cartList]
      const idItem = cartListBak.findIndex((prod) => prod.id === items.item.id)
      if (idItem === -1) {
        //Incorporo el nuevo item al carrito junto a la cantidad
        contenido= ([...cartList, { ...productosActualizar, cantidad: 1 }])
      } else {
        //Controlo si la nueva cantidad sumada a la que ya tenía, no supera la cantidad de stock, para sumar en el item que ya está en el carrito
        cartListBak[idItem].quantity + items.quantity > cartListBak[idItem].stock
          ? (cartListBak[idItem].quantity = cartListBak[idItem].stock)
          : (cartListBak[idItem].quantity += items.quantity)
        setCartList(cartListBak)
      }
    
  
    // 	Función para sumar la cantidades de items que tiene el carrito
    const itemsCart = () => {
      return cartList.reduce((prev, next) => prev + next.quantity, 0)
    }


    fs.writeFile(this.ruta, JSON.stringify(contenido, null, 2), (error) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log(contenido);
      }
    });
    return contenido;
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
