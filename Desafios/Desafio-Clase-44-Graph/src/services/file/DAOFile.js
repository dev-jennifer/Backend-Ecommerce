const ServiceDAOFile = require('./serviceDAO.fileDB');
class ProductDAOFile extends ServiceDAOFile {
  constructor() {
    super('./DB/products.json');
  }
}

class CartDAOFile extends ServiceDAOFile {
  constructor() {
    super('./DB/cart.json');
  }
}

class UserDAOFile extends ServiceDAOFile {
  constructor() {
    super('./DB/user.json');
  }
}
class OrdenDAOFile extends ServiceDAOFile {
  constructor() {
    super('./DB/order.json');
  }
}
module.exports = { ProductDAOFile, CartDAOFile, UserDAOFile, OrdenDAOFile };