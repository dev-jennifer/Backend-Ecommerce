const { CartDAOMongoDB } = require('../../DAOs/DAOMongo'),
 config = require('../../utils/config');

class CartDAOFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        console.log('Persistencia: ', config.SRV.persistencia);
        return new CartDAOMongoDB();
      default:
        return new CartDAOMongoDB();
    }
  }
}
module.exports = CartDAOFactory;
