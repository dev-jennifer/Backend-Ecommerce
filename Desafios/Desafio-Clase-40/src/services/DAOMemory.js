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

module.exports={ProductDAOMemory,CartDAOMemory}