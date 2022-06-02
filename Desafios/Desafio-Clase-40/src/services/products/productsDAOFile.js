const ContainerFile = require('../../containers/container.fileDB');
class ProductDAOFile extends ContainerFile {
  constructor() {
    super(  "./DB/products.json");
  }
}
module.exports = ProductDAOFile;
