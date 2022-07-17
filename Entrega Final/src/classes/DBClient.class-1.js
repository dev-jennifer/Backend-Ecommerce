const ErrorApi = require('./Error/customError');

class DBClient {
  async connect() {
    throw new ErrorApi(500, "Falta implementar 'connect' en Sub Clase");
  }

  async disconnect() {
    throw new ErrorApi(500, "Falta implementar 'connect' en Sub Clase");
  }
}

module.exports= DBClient;
