const fs = require("fs");
module.exports = class Carrito {
  constructor() {
    this.clave = "productos";
    this.productos = this.obtener();
    this.ruta = "./public/data/carrito.txt";
  }

  agregar(producto) {
      console.log("Agregar Metodo")
      console.log("producto recibido", producto)
      if (producto==''){

        this.productos.push(producto);
        // this.guardar();
      }
    if (!this.existe(producto.id)) {
      this.productos.push(producto);
      this.guardar();
    }
 return 
  }

  quitar(id) {
    const indice = this.productos.findIndex((p) => p.id === id);
    if (indice != -1) {
      this.productos.splice(indice, 1);
      this.guardar();
    }
  }

  guardar(producto) {

    let productoNuevo=JSON.parse(JSON.stringify(producto));
    console.log("Metodo Guardar", productoNuevo)

    let contenido = this.agregar(productoNuevo);
    let id = contenido.length + 1;
    let nuevoObjeto = { ...objeto, id };
    contenido.push("contenido",nuevoObjeto);
    console.log(contenido);

    fs.writeFile(this.ruta, JSON.stringify(contenido, null, 2), (error) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log("Nuevo ID: " + id);
        return id;
      }
    });
 
  }

  obtener() {
    /* global localStorage */
    let data;
    try {
      let jsonData = fs.readFileSync(this.ruta, "utf-8");
      data = JSON.parse(jsonData);
    } catch (error) {
      data = [];
    }
    return data;
  }

  // const productosCodificados = localStorage.getItem(this.clave);
  // return JSON.parse(productosCodificados) || [];

  existe(id) {
    console.log("2")
    return this.productos.find((producto) => producto.id === id);
  }

  obtenerConteo() {
    return this.productos.length;
  }
};
