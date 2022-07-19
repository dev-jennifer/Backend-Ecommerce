const logger = require('../../utils/loggers');

class APICustom {
  constructor() {

    (this.OK = 200),
      (this.BAD_REQUEST = 400),
      (this.NOT_FOUND = 404),
      (this.INTERNAL_SERVER = 500);

  }
   
  errorNotFound = (error, mensaje) => {
    logger.error(error, mensaje);
    return {
      success: false,
      message: 'Oops no se ha encontrado',
      customMessage: mensaje,
      code: 404,
    };
  };
  errorInternalServer = (error, mensaje) => {
    logger.error(error, mensaje);
    return {
      success: false,
      message: 'Error del servidor',
      customMessage: mensaje,
      code: 401,
    };
  };

  errorServer = (error, mensaje) => {
    logger.error(error, mensaje);
    return {
      success: false,
      message: 'Error del servidor',
      customMessage: mensaje,
      code: 500,
    };
  };
}

module.exports = APICustom;
