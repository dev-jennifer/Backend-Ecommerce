const CustomError = require('./CustomError.class'),
  DBClient = require('./DBClient.class'),
  config = require('../utils/config'),
  mongoose = require('mongoose')


class MongoDBClient extends DBClient {
  constructor() {
    super();
    this.connected = false;
    this.client = mongoose;
    console.log(config.MONGO_DB.MONGO_CONNECT.connection_string);
  }

  async connect() {
    try {
      await this.client.connect(
        config.MONGO_DB.MONGO_CONNECT.connection_string,
        config.MONGO_DB.OPTIONS
      );
      this.connected = true;
 
      console.log('Base de datos conectada');
    } catch (error) {
      throw new CustomError(500, 'Error al conectarse a mongodb', error);
    }
  }

  async disconnect() {
    try {
      await this.client.connection.close();
      this.connected = false;

      console.log('Base de datos desconectada');
    } catch (error) {
      throw new CustomError(500, 'Error al desconectarse a mongodb', error);
    }
  }
}

module.exports = MongoDBClient;
