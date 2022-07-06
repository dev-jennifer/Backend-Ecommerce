const { OrderDAOMongoDB } = require('../../DAOs/DAOMongo'),
 config = require('../../utils/config');

class OrderDAOFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        console.log('Persistencia: ', config.SRV.persistencia);
        return new OrderDAOMongoDB();


      default:
        return new OrderDAOMongoDB();
    }
  }
}
module.exports = OrderDAOFactory;
