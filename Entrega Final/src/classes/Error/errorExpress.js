const  HttpStatusCode=require("./httpStatusCodes")
const { BaseError, APIError } = require('./error');

 class HTTP400Error extends BaseError {
   constructor(description = 'bad request') {
     super('NOT FOUND', HttpStatusCode.BAD_REQUEST, true, description);
   }
 }

 module.exports = { HTTP400Error };