const ContenedorMongoDB = require('../containers/container.MongoDB'),
  UserModel = require('../models/user.model.mongo');

class UserDAOMongoDB extends ContenedorMongoDB {
  constructor() {
    super(UserModel);
  }
}
module.exports = UserDAOMongoDB;