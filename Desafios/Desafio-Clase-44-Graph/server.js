const express = require('express')
const { graphqlHTTP }=require("express-graphql")
const app = express();

// import RecordatorioController from './src/controllers/Recordatorio.controller.js';
const ProductoSchema =require('./src/graphql/product.schema');
const ProductsController=require("./src/controllers/products.controller")


app.use(express.static('public'));
 
app.use(
  '/graphql',
  graphqlHTTP({
    schema: ProductoSchema,
    rootValue: {
      renderProducts: ProductsController.renderProducts,
    //  getProduct: ProductsController.getProduct,
      saveProducts: ProductsController.saveProducts,
      deleteProduct: ProductsController.deleteProduct,
      editProduct: ProductsController.editProduct,
    },
    graphiql: true,
  })
);

const PORT = 6070;
app.listen(PORT, () => {
  const msg = `Servidor corriendo en puerto: http://localhost:${PORT}`;
  console.log(msg);
});

 /* GRAPQL
      query queryRender{
        renderProducts {
            nombre,
            descripcion,
            precio
        } 
    }

    mutation queryGuardar{
        saveProducts(datos: {
            nombre: "Manzana",
            descripcion: "Manzana es",
            precio:100
        }) {
            nombre
        }
    }

*/
  
//postman
// { 
// "operationName":"queryRender",
// "query":"query queryRender{renderProducts {nombre,descripcion,precio}}"
// }