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

module.exports = {ProductDAOFile,CartDAOFile}