const ContenedorMongoDB = require('../containers/container.MongoDB'),
  ProductModel = require('../models/products.model.mongo'),
  CartModel = require('../models/cart.model.mongo'),
  OrderModel = require('../models/order.model.mongo'),
  UserModel = require('../models/user.model.mongo');

class ProductosDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(ProductModel);
  }
}

class CartDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(CartModel);
  }
}

class OrderDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(OrderModel);
  }
}

class UserDAOMongoDB extends ContenedorMongoDB {
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
