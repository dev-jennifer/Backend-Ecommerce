const ProductDTO = require('../classes/Products/ProductsDTO.class');
const crypto=require("crypto")
const productos = [];

const ProductsController = {
  renderProducts() {
    return productos;
  },

  // getProduct({ id }) {
  //   try {
  //     let product = this.colecction.find((elem) => {
  //       return elem['id'] == id;
  //     });
  //     return product;
  //   } catch (error) {
  //     throw new Error(`Error al listar(id) ${error}`);
  //   }
  // },

  saveProducts({ datos }) {
    const id = crypto.randomBytes(10).toString('hex');
    const nuevoProducto = new ProductDTO(id, datos);
    productos.push(nuevoProducto);
    return nuevoProducto;
  },

  deleteProduct(req, res) {
    try {
      const index = this.colecction.findIndex((elem) => elem['id'] == id);

      if (index == -1) {
        doc = { code: 401, msg: 'ID no encontrado' };
      } else {
        doc = this.colecction.splice(index, 1);
      }

      return doc;
    } catch (error) {
      console.log('Error al eliminar');
    }
  },

  editProduct(req, res) {
    let doc = null;
    try {
      const index = this.colecction.findIndex((x) => x[condition] == id);

      if (index == -1) {
        doc = { code: 401, msg: 'Producto no encontrado' };
      } else {
        doc = { id: id, ...body };
        this.colecction[index] = doc;
      }
      return doc;
    } catch (error) {
      console.log(`Error al actualizar() ${error}`);
    }
  },
};

module.exports = ProductsController;
