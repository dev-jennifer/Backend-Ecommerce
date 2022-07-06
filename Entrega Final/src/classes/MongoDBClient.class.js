const DBClient = require('./DBClient.class'),
  config = require('../utils/config'),
  mongoose = require('mongoose');

class MongoDBClient extends DBClient {
  constructor() {
    super();
    this.connected = false;
    this.url = config.MONGO_DB.MONGO_CONNECT.url;
    this.options = config.MONGO_DB.MONGO_CONNECT.options;
  }

  connect = async () => {
    try {
      if (this.connected == true) {
        console.log('already connected');
        return;
      }
      await mongoose.connect(
        config.MONGO_DB.MONGO_CONNECT.url,
        config.MONGO_DB.MONGO_CONNECT.options
      );
      this.connected = true;
      console.log('Base de datos conectada');
    } catch (error) {
      throw new CustomError(500, 'Error al conectarse a mongodb', error);
    }
  };
  disconnect = async () => {
    try {
      await mongoose.connection.close();
      this.connected = false;

      console.log('Base de datos desconectada');
    } catch (error) {
      throw new CustomError(500, 'Error al desconectarse a mongodb', error);
    }
  };
}

module.exports = MongoDBClient;
