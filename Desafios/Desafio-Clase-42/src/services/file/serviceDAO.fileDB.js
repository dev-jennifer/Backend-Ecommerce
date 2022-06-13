const fs = require('fs').promises;
const logger = require('../../utils/loggers');
const DAO = require('../../classes/DAO.class');

class ServiceDAOFile extends DAO  {
  constructor(file) {
    super();
    this.ruta = file;
  }
  mostrarTodos = async () => {
    try {
      const content = await fs.readFile(this.ruta, 'utf8');
      const arr = JSON.parse(content);

      return arr;
    } catch (error) {
        return [];
     
     
    }
  };

  guardar = async (obj) => {
    let nuevoId;

    const doc = await this.mostrarTodos();
    if (doc.length === 0) {
      nuevoId = 1;
    } else {
      nuevoId = doc.length + 1;
    }
    const newObj = { id: nuevoId, ...obj };
    doc.push(newObj);
   
    try {
      await fs.writeFile(this.ruta, JSON.stringify(doc, null, 2));
      return newObj;
    } catch (error) {
      throw new Error(`Error al guardar:  ${error}`);
 
    }
  };

  // save(idCart, ProductoAgregado) {
  //   let fecha = new Date().toDateString();

  //   let newItemObj = {
  //     nombreProducto: ProductoAgregado.nombreProducto,
  //     descripcion: ProductoAgregado.descripcion,
  //     fotoProducto: ProductoAgregado.fotoProducto,
  //     codigo: ProductoAgregado.codigo,
  //     precioProducto: ProductoAgregado.precioProducto,
  //     stock: ProductoAgregado.stock,
  //     idProducto: ProductoAgregado.id,
  //     productDate: fecha,
  //     Quantity: 1,
  //   };

  //   let cart = this.getAll();
  //   let existe = false;
  //   let index = cart.findIndex((x) => x.BuyerID === idCart);

  //   if (index != -1) {
  //     for (let i = 0; i < cart[index].Productos.length; i++) {
  //       if (
  //         cart[index].Productos[i].idProducto == newItemObj.idProducto &&
  //         cart[index].Productos[i].productDate == newItemObj.productDate
  //       ) {
  //         cart[index].Productos[i].Quantity += newItemObj.Quantity;
  //         existe = true;
  //       }
  //     }
  //     if (!existe) {
  //       cart[index].Productos.push(newItemObj);
  //     }
  //   }

  //   fs.writeFile(this.ruta, JSON.stringify(cart, null, 2), (error) => {
  //     if (error) {
  //       throw new Error(error);
  //     } else {
  //       console.log(cart);
  //     }
  //   });
  //   return cart[index];
  // }

  eliminar = async (condicion, id) => {
    const objs = await this.mostrarTodos();
    const index = objs.findIndex((o) => o[condicion] == id);
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

  mostrarId = async (condition, id) => {
    try {
      const objs = await this.mostrarTodos();
      const doc = objs.find((o) => o[condition] == id);
      return doc;
    } catch (error) {
      throw new Error(`Error al mostrar producto. Id ${id} no encontrado`);
    }
  };

  existUser = async (email) => {
    try {
      const mostrar = await this.mostrarTodos();
      const doc = mostrar.find((o) => o.email == email);
      console.log('doc', doc);
      return doc;
    } catch (error) {
      throw new Error(`Error al mostrar user. Id ${id} no encontrado`);
    }
  };

  actualizar = async (condicion, id, body) => {
    let doc = null;
    const objs = await this.mostrarTodos();
    const index = objs.findIndex((o) => o[condicion] == id);
    console.log('CART ACTUAL', objs);
    console.log(index);
    if (index == -1) {
      doc = { code: 401, msg: 'No encontrado' };
    } else {
      doc = { id: id, ...body };
      objs[index] = doc;
    }

    try {
      await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
      console.log('CART nuevo', objs);
      logger.info(`Elemento modificado `);
      return doc;
    } catch (error) {
      throw new Error(`Error al modificar: ${error}`);
   
    }
  };

}

module.exports = ServiceDAOFile;
 