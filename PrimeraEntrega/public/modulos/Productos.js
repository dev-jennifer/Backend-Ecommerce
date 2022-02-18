const fs = require("fs");

module.exports = class Productos {
  constructor() {
    this.ruta = "./public/data/productos.txt";
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

  save(objeto) {
    let contenido = this.getAll();

    let id = contenido.length + 1;
    let nuevoObjeto = { ...objeto, id };
    contenido.push(nuevoObjeto);

    fs.writeFile(this.ruta, JSON.stringify(contenido, null, 2), (error) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log("Nuevo ID: " + id);
        return id;
      }
    });
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

  actualizar(numero, body) {
    console.log("paso2")
    const ExistenteID = this.getById(numero);
    console.log(body);

    let nuevo = JSON.parse(body);
    console.log(nuevo);

    let productosActualizar = {
      nombreProducto: nuevo.nombreProducto,
      descripcion: nuevo.descripcion,
      fotoProducto: nuevo.fotoProducto,
      codigo: nuevo.codigo,
      precioProducto: nuevo.precioProducto,
      stock: nuevo.stock,
    };
    // console.log("prod actualizar", productosActualizar)// Uncaught SyntaxError: Unexpected token o in JSON at position 1
    console.log(productosActualizar);

    if (ExistenteID != false) {
      for (let key of Object.keys(productosActualizar)) {
        productosActualizar[key]
          ? (ExistenteID[numero][key] = productosActualizar[key])
          : ExistenteID[numero][key];
      }
    }
  }

  deleteById(numero) {
    const contenidoExistente = this.getAll();

    const index = contenidoExistente.findIndex((x) => x.id === numero);
    console.log(contenidoExistente);
    console.log("id:", numero);

    let mensaje;
    if (index != -1) {
      contenidoExistente.splice(index, 1);
      console.log(contenidoExistente);
      fs.writeFile(
        this.ruta,
        JSON.stringify(contenidoExistente, null, 2),
        (error) => {
          if (error) {
            throw new Error(error);
          } else {
            mensaje = "Se ha eliminado el ID:";
          }
        }
      );
    }
    return mensaje;
  }
};
