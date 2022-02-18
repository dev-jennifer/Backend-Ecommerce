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

  actualizarDato(numero, body) {
    const ExistenteID = this.getById(parseInt(numero));

    let nuevo = JSON.parse(JSON.stringify(body));
 

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
    const index = contenido.findIndex((x) => x.id === parseInt(numero));

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
