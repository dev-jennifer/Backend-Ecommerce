const httpStatusCodes=require("./httpStatusCodes")
class BaseError extends Error {
 
 constructor(name,httpCode,description, isOperational) {
   super(description);
   Object.setPrototypeOf(this, new.target.prototype);
 
   this.name = name;
   this.httpCode = httpCode;
   this.isOperational = isOperational;
 
 }
}

//free to extend the BaseError
class APIError extends BaseError {
  constructor(
    name,
    httpCode = httpStatusCodes.INTERNAL_SERVER,
    isOperational = true,
    description = 'internal server error'
  ) {
    super(name, httpCode, isOperational, description);
  }
}
module.exports = { BaseError, APIError, httpStatusCodes };