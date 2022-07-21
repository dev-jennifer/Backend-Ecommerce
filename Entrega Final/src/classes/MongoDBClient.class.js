const APICustom = require('./Error/customError'),
  config = require('../utils/config'),
  mongoose = require('mongoose'),
  logger = require('../utils/loggers');

class MongoDBClient {
  constructor() {

    this.client = mongoose;
    this.message = new APICustom();
  }

  connect = async () => {
    try {
      //Conectado
      if (this.client.connection.readyState == 1) {
        logger.info('***Conexion en curso****');
      }
      //Desconectado
      if (this.client.connection.readyState == 0) {
        await this.client.connect(
          config.MONGO_DB.MONGO_CONNECT.url,
          config.MONGO_DB.MONGO_CONNECT.options
        );
        const timeID = Date.now();
        logger.info(`Base de datos conectada  ${timeID}`);
      }

    
    } catch (error) {
      this.message.errorServer(error, 'Error al conectarse a mongodb');
    }
  };
}

module.exports = MongoDBClient;
