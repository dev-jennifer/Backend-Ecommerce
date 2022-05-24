const ContenedorMongoDB =require("../containers/container.MongoDB");
const ProductModel=require("../models/products.model.mongo")

class ProductosDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(ProductModel)
  }
}

module.exports = ProductosDAOMongoDB;