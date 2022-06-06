const ContainerMemory=require("../containers/container.memoryDB")

class ProductDAOMemory extends ContainerMemory{
    constructor(){
        super()
    }
}

class CartDAOMemory extends ContainerMemory {
  constructor() {
    super();
  }
}

class OrdenDAOMemory extends ContainerMemory {
  constructor() {
    super();
  }
}
class UserDAOMemory extends ContainerMemory {
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