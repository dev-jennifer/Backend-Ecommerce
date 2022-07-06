const ServiceDAOMongoDB = require('../services/serviceDAO.MongoDB'),
  ProductModel = require('../models/products.model.mongo'),
  CartModel = require('../models/cart.model.mongo'),
  OrderModel = require('../models/order.model.mongo'),
  UserModel = require('../models/user.model.mongo');

class ProductosDAOMongoDB extends ServiceDAOMongoDB {
  constructor() {
    super(ProductModel);
  }
}

class CartDAOMongoDB extends ServiceDAOMongoDB {
  constructor() {
    super(CartModel);
  }
}

class OrderDAOMongoDB extends ServiceDAOMongoDB {
  constructor() {
    super(OrderModel);
  }
}

class UserDAOMongoDB extends ServiceDAOMongoDB {
  constructor() {
    super(UserModel);
  }
}
module.exports = {
  ProductosDAOMongoDB,
  CartDAOMongoDB,
  OrderDAOMongoDB,
  UserDAOMongoDB,
};
