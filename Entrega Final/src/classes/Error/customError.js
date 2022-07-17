const logger = require('../../utils/loggers');

class APIError {
  constructor() {
    (this.OK = 200),
      (this.BAD_REQUEST = 400),
      (this.NOT_FOUND = 404),
      (this.INTERNAL_SERVER = 500);
  }

  errorInternalServer = (error,mensaje) => {
    logger.error(error,mensaje);
    return {
      success: false,
      message: 'Error del servidor',
      customMessage: mensaje,
      code:401
    };
  };
}

module.exports = APIError;
