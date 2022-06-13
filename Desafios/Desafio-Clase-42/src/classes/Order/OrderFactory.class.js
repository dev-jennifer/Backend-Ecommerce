const { OrderDAOMongoDB } = require('../../services/mongoDb/DAOMongo'),
  { OrdenDAOFile } = require('../../services/file/DAOFile'),
  { OrdenDAOMemory } = require('../../services/memory/DAOMemory');
const config = require('../../utils/config');

class OrderDAOFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        console.log('Persistencia: ', config.SRV.persistencia);
        return new OrderDAOMongoDB();

      case 'file':
        return new OrdenDAOFile();

      case 'memory':
        return new OrdenDAOMemory();

      default:
        return new OrderDAOMongoDB();
    }
  }
}
module.exports = OrderDAOFactory;
