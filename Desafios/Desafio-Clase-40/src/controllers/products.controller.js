const ProductDTO = require('../classes/ProductsDTO.class');
const {ProductDAOFile} = require('../services/DAOFile');
const {ProductosDAOMongoDB} = require('../services/DAOMongo');
const {ProductDAOMemory}=require('../services/DAOMemory')
const config = require('../utils/config');
let admin = true;

let ProductsDAO = null;

switch (config.SRV.persistencia) {
  case 'mongodb':
    ProductsDAO = new ProductosDAOMongoDB();
    break;
  case 'file':
    ProductsDAO = new ProductDAOFile();
    break;
  case 'memory':
    ProductsDAO = new  ProductDAOMemory();
    break;
  default:
    break;
}

const ProductsController = {
  renderNewProduct: (req, res) => {
    if (admin == true) {
      res.render('productNew', { title: 'Nuevo Producto' });
    } else {
      res.json({
        error: -1,
        descripcion: `ruta ${'/'} método POST no autorizado`,
      });
    }
  },
  renderProducts: async (req, res) => {
    try {
      const docs = await ProductsDAO.mostrarTodos();

      const productos = docs.map((p) => {
        return new ProductDTO(
          p.id,
          p.nombre,
          p.descripcion,
          p.foto,
          p.codigo,
          p.precio,
          p.stock
        );
      });

      res.render('products', {
        title: 'Products',
        productos: productos,
      });
    } catch (error) {
      throw new Error(`Error al renderizar productos: ${error}`);
    }
  },

  saveProducts: async (req, res) => {
    if (admin == true) {
      const body = req.body;
      await ProductsDAO.guardar(body).then(() => {
        try {
          res.redirect('/api/productos/');
        } catch (error) {
          throw new Error(`Error al guardar productos productos: ${error}`);
        }
      });
    } else {
      throw new Error(`Acceso no autorizado: ${error}`);
    }
  },
  deleteProduct: async (req, res) => {
    if (admin == true) {
      const valueID = req.params.id;

      try {
        await ProductsDAO.eliminar(valueID).then(() => {
          res.redirect('/api/productos/');
        });
      } catch (error) {
        throw new Error(`Error al  eliminar ${valueID}, ${error}`);
      }
    } else {
      throw new Error(`Acceso no autorizado: ${error}`);
    }
  },

  getProduct: async (req, res) => {
    const id = req.params.id;
    try {
      const doc = await ProductsDAO.mostrarId(id);

      const productsDto = new ProductDTO(
        doc.id,
        doc.nombre,
        doc.descripcion,
        doc.foto,
        doc.codigo,
        doc.precio,
        doc.stock
      );

      res.render('productDetail', {
        producto: productsDto,
        error: false,
      });
    } catch (error) {
      res.render('productDetail', {
        error: true,
        mensaje: 'No se encuentra el producto',
      });
      throw new Error(`Error al  obtener producto ${id}, ${error}`);
    }
  },
  formEditProduct: async (req, res) => {
    if (admin == true) {
      const id = req.params.id;
      try {
        await ProductsDAO.mostrarId(id).then((result) => {
          res.render('productEdit', {
            title: 'Editar',
            data: result,
          });
        });
      } catch (error) {
        throw new Error(`Error al  editar producto ${id}, ${error}`);
      }
    } else {
      throw new Error(`Ruta no autorizada`);
    }
  },
  showID: async (itemId) => {
    try {
      const product = await ProductsDAO.mostrarId('id', itemId);
      console.log("product",product)
      return product;
    } catch (error) {
      throw new Error(`Error al mostrar producto ${itemId}`);
    }
  },
  editProduct: async (req, res) => {
    if (admin == true) {
      const id = req.params.id;
      const body = req.body;
      const condicion = 'id';

      try {
        await ProductsDAO.actualizar(condicion, id, body)
      res.send(200);
      } catch (error) {
        throw new Error(`Error al editar producto`);
      }
    } else {
      throw new Error(`Ruta no autorizada`);
    }
  },
};

module.exports = ProductsController;
