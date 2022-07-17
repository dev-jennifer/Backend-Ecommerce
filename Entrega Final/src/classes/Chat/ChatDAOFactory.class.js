const { ChatDAOMongoDB } = require('../../DAOs/DAOMongo'),
  config = require('../../utils/config');

class ChatDAOFactory {
  static get() {
    switch (config.SRV.persistencia) {
      case 'mongodb':
        return new ChatDAOMongoDB();
      default:
        return new ChatDAOMongoDB();
    }
  }
}
module.exports = ChatDAOFactory;
