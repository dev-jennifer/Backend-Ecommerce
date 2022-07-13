const { UserDAOMongoDB } = require('../../DAOs/DAOMongo'),
 config = require('../../utils/config');

class UserDAOFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        console.log('Persistencia: ', config.SRV.persistencia);
        return new UserDAOMongoDB();

      default:
        return new UserDAOMongoDB();
    }
  }
}
module.exports = UserDAOFactory;
