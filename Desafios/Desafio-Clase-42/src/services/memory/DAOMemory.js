const ServiceDAOMemory = require('./serviceDAO.memoryDB');

class ProductDAOMemory extends ServiceDAOMemory {
  constructor() {
    super();
  }
}

class CartDAOMemory extends ServiceDAOMemory {
  constructor() {
    super();
  }
}

class OrdenDAOMemory extends ServiceDAOMemory {
  constructor() {
    super();
  }
}
class UserDAOMemory extends ServiceDAOMemory {
  constructor() {
    super();
  }
}
module.exports = {
  ProductDAOMemory,
  CartDAOMemory,
  OrdenDAOMemory,
  UserDAOMemory,
};