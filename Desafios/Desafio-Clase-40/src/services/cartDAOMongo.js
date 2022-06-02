const ContenedorMongoDB=require("../containers/container.MongoDB"),
CartModel=require("../models/cart.model.mongo")

class CartDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    
    super(CartModel)
  }}

  module.exports = CartDAOMongoDB;
