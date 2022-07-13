const ProductDTO = require('../classes/Products/ProductsDTO.class');
const ProductDAOFactory = require('../classes/Products/ProductDAOFactory.class');
const logger = '../utils/loggers.js';


class ProductsController {
  constructor() {
    this.ProductsDAO = ProductDAOFactory.get();
  }
  ///////FUNCIONES GENERALES////////
  productsAll = async () => {
    const docs = await this.ProductsDAO.mostrarTodos();
    const productos = docs.map((p) => {
      return new ProductDTO(p);
    });
    return productos;
  };

  categories = async () => {
    const cat = await this.ProductsDAO.mostrarTodasCategorias();
    return cat;
  };

  productId = async (id) => {
    const doc = await this.ProductsDAO.mostrarId('id', id);
    const productsDto = new ProductDTO(doc);
    return productsDto;
  };

  productCategory = async (id) => {
    const docs = await this.ProductsDAO.mostrarCategoria(id);
    const productos = docs.map((p) => {
      return new ProductDTO(p);
    });
    return productos;
  };

  ///////PRINT JSON////////
  getProducts = async (req, res) => {
    try {
      res.status(200).json({ product: await this.productsAll() });
    } catch (error) {
      logger.error('Error al renderizar productos', error);
      res.status(400).send('Status: No se ha renderizar productos');
    }
  };

  getProductId = async (req, res) => {
    const id = req.params.id;
    try {
      res.status(200).json({ producto: await this.productId(id) });
    } catch (error) {
      logger.error('Error al renderizar producto Id:', error);
      res.status(404).send('Status: Not Found');
    }
  };

  getCategoriaId = async (req, res) => {
    const id = req.params.id;
    try {
      res.status(200).json({
        producto: await this.ProductsDAO.mostrarCategoria(id),
      });
    } catch (error) {
      logger.error('Error al renderizar categoria Id:', error);
      res.status(404).send('Status: Not Found');
    }
  };

  // showID = async (itemId) => {
  //   // const product = await this.ProductsDAO.mostrarId('id', itemId);
  //   // return product;
  //   await this.ProductsDAO.mostrarId('id', itemId)
  //     .then((res) => {
  //       res.status(200).send(res);
  //     })
  //     .catch((error) => {
  //       res.status(404).send('Status: Not Found');
  //     });
  // };
  saveProducts = async (req, res) => {
    if (admin == true) {
      try {
        await this.ProductsDAO.guardar(req.body);
        res.status(200).json({ status: true, result: 'Producto Guardado' });
      } catch {
        res.status(400).send('Status: No se ha podido guardar el producto');
      }
    } else {
      res.status(401).send('Status: Acceso no autorizado');
    }
  };

  deleteProduct = async (req, res) => {
    if (admin == true) {
      await this.ProductsDAO.eliminar('id', req.params.id)
        .then(() => {
          res.status(200).send('Status: Producto Eliminado');
        })
        .catch((error) =>
          res.status(404).send('Status: No se ha podido eliminar producto')
        );
    }
  };

  formEditProduct = async (req, res) => {
    if (admin == true) {
      const id = req.params.id;

      await this.ProductsDAO.mostrarId('id', id)
        .then((result) => {
          res.status(200).json({ title: 'Editar', data: result });
        })
        .catch((error) =>
          res.status(404).send('Status: No se ha podido eliminar producto')
        );
    } else {
      res.status(401).send('Status: Acceso no autorizado');
    }
  };

  editProduct = async (req, res) => {
    if (admin == true) {
      const id = req.params.id;
      const body = req.body;
      try {
        await this.ProductsDAO.actualizar(id, body);
        res.status(200).send('Producto actualizado');
      } catch (error) {
        res.status(400).send('Status: No se ha podido actualizar');
      }
    } else {
      res.status(401).send('Status: Acceso no autorizado');
    }
  };
}

module.exports = ProductsController;
