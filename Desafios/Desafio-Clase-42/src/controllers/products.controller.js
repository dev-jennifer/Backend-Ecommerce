const ProductDTO = require('../classes/Products/ProductsDTO.class');
const ProductDAOFactory = require('../classes/Products/ProductDAOFactory.class');
const { APIError, httpStatusCodes } = require('../classes/Error/error');

let admin = true;

class ProductsController {
  constructor() {
    this.ProductsDAO = ProductDAOFactory.get();
  }

  renderNewProduct = async (req, res) => {
    if (admin == true) {
      res.render('productNew', { title: 'Nuevo Producto' });
    } else {
      throw new CustomError(500, 'Error en Metodo Render Producto');
    }
  };
  renderProducts = async (req, res) => {
    try {
      const docs = await this.ProductsDAO.mostrarTodos();

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
         res.status(400).send('Status: No se ha renderizar productos');
    }
  };

  saveProducts = async (req, res) => {
    if (admin == true) {
      const body = req.body;

      await this.ProductsDAO.guardar(body).then(() => {
        try {
          res.redirect('/api/productos/');
        } catch (error) {
          res.status(400).send('Status: No se ha podido eliminar producto');
        }
      });
    } else {
      return res.send('No autorizado');
    }
  };
  deleteProduct = async (req, res) => {
    if (admin == true) {
      const valueID = req.params.id;

      try {
        await this.ProductsDAO.eliminar('id', valueID).then(() => {
          res.redirect('/api/productos/');
        });
      } catch (error) {
          res.status(404).send('Status: No se ha podido eliminar producto');
      }
    }
  };

  getProduct = async (req, res) => {
    const id = req.params.id;
    try {
      const doc = await this.ProductsDAO.mostrarId('id', id);

      const productsDto = new ProductDTO(
        doc.id,
        doc.nombre,
        doc.descripcion,
        doc.foto,
        doc.codigo,
        doc.precio,
        doc.stock
      );
      res.json({
        producto: productsDto,
      });
      // res.render('productDetail', {
      //   producto: productsDto,
      //   error: false,
      // });
    } catch (error) {
      res.status(404).send('Status: Not Found');
    }
  };
  formEditProduct = async (req, res) => {
    if (admin == true) {
      const id = req.params.id;
      try {
        await this.ProductsDAO.mostrarId('id', id).then((result) => {
          res.render('productEdit', {
            title: 'Editar',
            data: result,
          });
        });
      } catch (error) {
        throw new CustomError(
          500,
          `Error al  editar producto ${id},},${error}`
        );
      }
    } else {
      throw new CustomError(500, `Ruta no autorizada `);
    }
  };
  showID = async (itemId) => {
    try {
      const product = await this.ProductsDAO.mostrarId('id', itemId);
      console.log('ITEM_show', itemId);
      console.log(product);
      return product;
    } catch (error) {
      throw new CustomError(500, `Error al mostrar producto ${itemId}`);
    }
  };
  editProduct = async (req, res) => {
    if (admin == true) {
      const id = req.params.id;
      const body = req.body;

      try {
        await this.ProductsDAO.actualizar('id', id, body);
        res.status(200).send('Producto actualizado');
      } catch (error) {
        res.send('No se ha podido actualizar');
      }
    } else {
      throw new CustomError(500, `Ruta no autorizada`);
    }
  };
}

module.exports = ProductsController;
