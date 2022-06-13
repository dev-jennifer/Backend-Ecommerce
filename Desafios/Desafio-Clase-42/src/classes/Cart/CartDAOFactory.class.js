const { CartDAOMongoDB } = require('../../services/mongodb/DAOMongo'),
  { CartDAOFile } = require('../../services/file/DAOFile'),
  { CartDAOMemory } = require('../../services/memory/DAOMemory');
const config = require('../../utils/config');

class CartDAOFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        console.log('Persistencia: ', config.SRV.persistencia);
        return new CartDAOMongoDB();

      case 'file':
        return new CartDAOFile();

      case 'memory':
        return new CartDAOMemory();

      default:
        return new CartDAOMongoDB();
    }
  }
}
module.exports = CartDAOFactory;
