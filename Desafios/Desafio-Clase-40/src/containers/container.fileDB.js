const fs = require('fs').promises;
const CustomError = require('../classes/CustomError.class');
class ContainerFile {
  constructor(file) {
    this.ruta = file;
  }
  mostrarTodos = async () => {
    try {
      const content = await fs.readFile(this.ruta, 'utf8');
      const arr = JSON.parse(content);

      return arr;
    } catch (error) {
      new CustomError(500, 'Error al mostrar', error);
      return [];
    }
  };

  guardar = async (obj) => {
    let nuevoId;
    const o = await this.mostrarTodos();
    if (o.length === 0) {
      nuevoId = 1;
    } else {
      nuevoId = o.length + 1;
    }
    const newObj = { id: nuevoId, ...obj };
     o.push(newObj);
   console.log('newObj', newObj);
    try {
     const resultado= fs.writeFile(this.ruta, JSON.stringify(o, null, 2));
    console.log('this.ruta', this.ruta);
        console.log('newObj', resultado);
     return resultado
    
    } catch (error) {
      new CustomError(500, 'Error al guardar', error);
    }
  };

 

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

  eliminar = async (id) => {
    const objs = await this.mostrarTodos();
    const index = objs.findIndex((o) => o.id == id);
    if (index == -1) {
      throw new Error(`Error al borrar: no se encontró el id ${id}`);
    }

    objs.splice(index, 1);
    try {
      await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  };

  mostrarId = async (id) => {
    try {
      const objs = await this.mostrarTodos();
      const doc = objs.find((o) => o.id == id);
      return doc;
    } catch (error) {
      throw new Error(`Error al mostrar producto. Id ${id} no encontrado`);
    }
  };

  existUser = (email) => {
    try {
      let doc = this.coleccion.findOne({ email: email });
      return doc;
    } catch (error) {
      throw new Error(`Error al mostrar user. Id ${id} no encontrado`);
    }
  };

  actualizar = async (condicion, id, body) => {
    const valueID = id;
    const productos = await this.mostrarTodos();
    let productosActualizar = {
      nombre: body.nombre,
      descripcion: body.descripcion,
      foto: body.foto,
      codigo: body.codigo,
      precio: body.precio,
      stock: body.stock,
    };
    const index = productos.findIndex((x) => x.id === parseInt(valueID));
    if (index == -1) {
      throw new Error(`Error al modificar. Id ${id} no encontrado`);
    } else {
      for (let key of Object.keys(productosActualizar)) {
        productosActualizar[key]
          ? (productos[index][key] = productosActualizar[key])
          : productos[index][key];
      }
      try {
        await fs.writeFile(this.ruta, JSON.stringify(productos, null, 2));
      } catch (error) {
        throw new Error(`Error al modificar: ${error}`);
      }
    }
  };
}
module.exports = ContainerFile;
