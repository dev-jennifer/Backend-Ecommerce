const { buildSchema } = require('graphql');

const ProductoSchema = buildSchema(`

  input ProductoInput {
    nombre: String,
    descripcion: String,
    foto: String,
    codigo: String,
    precio: Float,
    stock:Float
  }
  type Producto {
    id: ID!
    nombre: String,
    descripcion: String,
    foto: String,
    codigo: String,
    precio: Float,
    stock:Float
  }

  type Query {
    renderProducts:[Producto],
    getProduct: [Producto],
  }
  type Mutation {
    saveProducts(datos: ProductoInput): Producto,
    deleteProduct(id: ID!): Producto,
    editProduct: [Producto],
  }



`);

module.exports = ProductoSchema;
