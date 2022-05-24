const ContenedorMongoDB = require('../containers/container.MongoDB'),
OrderModel=require("../models/order.model.mongo")
class OrderDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(OrderModel)
  }
}

module.exports = OrderDAOMongoDB;
