const ProductDTO = require('../classes/Products/ProductsDTO.class');
const ProductDAOFactory = require('../classes/Products/ProductDAOFactory.class');

let admin = true;

class ProductsController {
  constructor() {
    this.ProductsDAO = ProductDAOFactory.get();
  }

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

      res.render('productDetail', {
        producto: productsDto,
        error: false,
      });
    } catch (error) {
      res.status(404).send('Status: Not Found');
    }
  };
  showID = async (itemId) => {
    // const product = await this.ProductsDAO.mostrarId('id', itemId);
    // return product;
    await this.ProductsDAO.mostrarId('id', itemId)
      .then((res) => {
        res.status(200).send(res);
      })
      .catch((error) => {
        res.status(404).send('Status: Not Found');
      });
  };
  saveProducts = async (req, res) => {
    if (admin == true) {
      try {
        await this.ProductsDAO.guardar(req.body);

        res.status(200).send('Status: Producto Guardado');
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
  renderNewProduct = async (req, res) => {
    if (admin == true) {
      try {
        res.render('productNew', { title: 'Nuevo Producto' });
      } catch {
        res.status(400).send('Status: Error en ruta');
      }
    } else {
      res.status(401).send('Status: Acceso no autorizado');
    }
  };
  formEditProduct = async (req, res) => {
    if (admin == true) {
      const id = req.params.id;

      await this.ProductsDAO.mostrarId('id', id)
        .then((result) => {
          res.render('productEdit', {
            title: 'Editar',
            data: result,
          });
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
        await this.ProductsDAO.actualizar('id', id, body);
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
