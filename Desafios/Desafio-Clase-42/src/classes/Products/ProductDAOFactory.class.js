const { ProductDAOFile } = require('../../services/file/DAOFile');
const { ProductosDAOMongoDB } = require('../../services/mongodb/DAOMongo');
const { ProductDAOMemory } = require('../../services/memory/DAOMemory');
const config = require("../../utils/config")

class ProductDAOFactory {
  static get() {
       console.log('Persistencia: ', config.SRV.persistencia);
    switch (config.SRV.persistencia) {
        
      case 'mongodb':
      
        return new ProductosDAOMongoDB();
 
      case 'file':

       return new ProductDAOFile();
    
      case 'memory':
      return new ProductDAOMemory();
   
      default:
        return ;
    }
  }
}
module.exports = ProductDAOFactory;
