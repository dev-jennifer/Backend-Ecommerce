const logger = require('../../utils/loggers');

class APIError {
  constructor() {
 
  }

  errorInternalServer = (error,mensaje) => {
    logger.error(error,mensaje);
    return {
      success: false,
      message: 'Error del servidor',
      customMessage: mensaje,
      code:401
    },

    errorServer = (error,mensaje) => {
    logger.error(error,mensaje);
    return {
      success: false,
      message: 'Error del servidor',
      customMessage: mensaje,
      code:500
    }

  };
}
}

module.exports = APIError;
