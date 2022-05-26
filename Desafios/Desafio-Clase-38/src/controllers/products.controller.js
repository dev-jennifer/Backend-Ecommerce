const ProductosDAOMongoDB = require('../services/productsDAOMongo');
const ProductsDAO = new ProductosDAOMongoDB();
const path = require('path');
let admin = true;

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
      await ProductsDAO.mostrarTodos().then((respuesta) => {
        res.render('products', {
          title: 'Products',
          productos: respuesta,
        });
      });
    } catch (error) {
      console.log('error', error);
      res.send({
        code: 400,
        failed: 'Error',
      });
    }
  },

  saveProducts: async (req, res) => {
    if (admin == true) {
      const body = req.body;
      await ProductsDAO.guardar(body).then((result) => {
        try {
          res.redirect('/api/productos/');
        } catch (error) {
          console.log('error', error);
        }
      });
    } else {
      res.json({
        error: -1,
        descripcion: `ruta ${'/'} método POST no autorizado`,
      });
    }
  },
  deleteProduct: async (req, res) => {
    if (admin == true) {
      const valueID = req.params.id;
      try {
        await ProductsDAO.eliminar(valueID).then((result) => {
          res.redirect('/api/productos/');
        });
      } catch (error) {
        console.error(`Error al  eliminar ${valueID}, ${error}`);
      }
    } else {
      res.json({
        error: -1,
        descripcion: `ruta ${'/:id'} método delete no autorizado`,
      });
      console.log('Error');
    }
  },

  getProduct: async (req, res) => {
    const id = req.params.id;
    try {
      await ProductsDAO.mostrarId(id).then((respuesta) => {
        res.render('productDetail', {
          producto: respuesta,
          error: false,
        });
      });
    } catch (error) {
      console.log('error', error);
      res.render('productDetail', {
        error: true,
        mensaje: 'No se encuentra el producto',
      });
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
        res.send({
          code: 400,
          failed: 'Error',
        });
      }
    } else {
      res.json({
        error: -1,
        descripcion: `ruta ${'/'} método POST no autorizado`,
      });
    }
  },
  showID: async (itemId) => {
    try {
      const product = await ProductsDAO.mostrarId('id', itemId);
      return product;
    } catch (error) {
      console.error(error);
    }
  },
  editProduct: async (req, res) => {
    if (admin == true) {
      const id = req.params.id;
      const body = req.body;
      const condicion = 'id';
      try {
        await ProductsDAO.actualizar(condicion, id, body).then((result) => {
          res.json({
            mensaje: 'Producto actualizado',
          });
        });
      } catch (error) {
        res.json({
          estado: false,
          mensaje: 'Producto falla',
        });
      }
    } else {
      res.json({
        error: -1,
        descripcion: `ruta ${'/'} método POST no autorizado`,
      });
      console.log('Error');
    }
  },
};

module.exports = ProductsController;
