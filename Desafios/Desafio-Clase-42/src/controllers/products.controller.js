const ProductDTO = require('../classes/Products/ProductsDTO.class');
const CustomError = require('../classes/CustomError.class');
const ProductDAOFactory = require('../classes/Products/ProductDAOFactory.class');

let admin = true;

class ProductsController {
  constructor() {
    this.ProductsDAO = ProductDAOFactory.get();
  }

  renderNewProduct = async (req, res) => {
    if (admin == true) {
      res.render('productNew', { title: 'Nuevo Producto' });
    } else {
      throw new CustomError(500, 'Error en Metodo Render Producto' );
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
     return res.send('Hubo un error');
    }
  };

  saveProducts = async (req, res) => {
    if (admin == true) {
      const body = req.body;

      await this.ProductsDAO.guardar(body).then(() => {
        try {
          res.redirect('/api/productos/');
        } catch (error) {
           res.status(error.response.status);
           return res.send(error.message);
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
        return res.send("No se ha podido eliminar");
      }
    }
  };

  getProduct = async (req, res) => {
    const id = req.params.id;
    try {
      const doc = await this.ProductsDAO.mostrarId(id);

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
      throw new CustomError(500, `Error al  obtener producto ${id},${error}`);
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
        res.status(200).send("Producto actualizado");
      } catch (error) {
        res.send("No se ha podido actualizar");
      }
    } else {
      throw new CustomError(500, `Ruta no autorizada`);
    }
  };
}

module.exports = ProductsController;
