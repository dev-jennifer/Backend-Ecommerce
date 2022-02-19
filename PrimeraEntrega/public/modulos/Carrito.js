const fs = require("fs");
module.exports = class Carrito {
  constructor() {
    this.ruta = "./public/data/carrito.txt";
  }

  getAll() {
    let data;
    try {
      let jsonData = fs.readFileSync(this.ruta, "utf-8");
      data = JSON.parse(jsonData);
    } catch (error) {
      data = {};
    }
    return data;
  }
  crearCarrito() {
    let contenido = this.getAll();
    console.log(contenido);
    let id
    if (contenido == '') {
      console.log("error1");
      id = contenido.length + 1;
      let nuevoObjeto = { ...contenido, id };
      contenido.push(nuevoObjeto);
    } else {
      console.log("error2");
      id = 1;
      contenido=({id});
      console.log(contenido);
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
  save(idProducto, idCart) {
    const ExisteIdCart = this.getById(parseInt(idCart));
    console.log("ID Producto", idProducto);
    let contenido = this.getAll();

    let id = contenido.length + 1;
    let nuevoObjeto = { ...objeto, id };
    contenido.push(nuevoObjeto);
    fs.writeFile(this.ruta, JSON.stringify(contenido, null, 2), (error) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log("Nuevo ID: " + id);
      }
    });
    return id;
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

  getById(numero) {
    const contenidoExistente = this.getAll();
    const index = contenidoExistente.findIndex((x) => x.id === numero);
    let mensaje = false;

    if (index != -1) {
      mensaje = contenidoExistente[index];
    }
    return mensaje;
  }

  agregarProducto(idProducto) {
 
 
    const ExistenteID = this.getById(parseInt(idProducto));
    let nuevo = JSON.parse(JSON.stringify(idProducto));
    let productosActualizar = {
      nombreProducto: nuevo.nombreProducto,
      descripcion: nuevo.descripcion,
      fotoProducto: nuevo.fotoProducto,
      codigo: nuevo.codigo,
      precioProducto: nuevo.precioProducto,
      stock: nuevo.stock,
    };
    console.log("nombre", productosActualizar);
    let contenido = this.getAll();
    const index = contenido.findIndex((x) => x.id === parseInt(id));

    if (index == -1) {
      res.send({ code: 400, failed: "Producto no Encontrado" });
    } else {
      for (let key of Object.keys(productosActualizar)) {
        productosActualizar[key]
          ? (contenido[index][key] = productosActualizar[key])
          : contenido[index][key];
      }
      fs.writeFile(this.ruta, JSON.stringify(contenido, null, 2), (error) => {
        if (error) {
          throw new Error(error);
        } else {
          console.log("actualizado");
        }
      });
    }
  }
};
