const ContainerFile = require('../containers/container.fileDB');
class ProductDAOFile extends ContainerFile {
  constructor() {
    super('./DB/products.json');
  }
}

class CartDAOFile extends ContainerFile {
  constructor() {
    super('./DB/cart.json');
  }
}

class UserDAOFile extends ContainerFile {
  constructor() {
    super('./DB/user.json');
  }
}
class OrdenDAOFile extends ContainerFile {
  constructor() {
    super('./DB/order.json');
  }
}
module.exports = { ProductDAOFile, CartDAOFile, UserDAOFile, OrdenDAOFile };