const DBClient = require('./DBClient.class'),
  config = require('../utils/config'),
  mongoose = require('mongoose'),
  logger = require('../utils/loggers');

class MongoDBClient extends DBClient {
  constructor() {
    super();
    this.connected = false;
    this.url = config.MONGO_DB.MONGO_CONNECT.url;
    this.client = mongoose; 
  }

  connect = async () => {
    try {
      // if (this.connected == true) {
      //   console.log('already connected');
      //   return;
      // }
      await this.client.connect(
        config.MONGO_DB.MONGO_CONNECT.url,
        config.MONGO_DB.MONGO_CONNECT.options
      );
       logger.info('Base de datos conectada');
     return this.connected = true;
     
    } catch (error) {
      throw new CustomError(500, 'Error al conectarse a mongodb', error);
    }
  };
  disconnect = async () => {
    try {
      await this.client.connection.close();
      this.connected = false;

      logger.info('Base de datos desconectada');
    } catch (error) {
      throw new CustomError(500, 'Error al desconectarse a mongodb', error);
    }
  };
}

module.exports = MongoDBClient;
