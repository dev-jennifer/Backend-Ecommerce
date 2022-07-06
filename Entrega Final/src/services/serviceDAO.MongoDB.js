const DAO = require('../DAOs/DAO.class');
const MongoDBClient = require('../classes/MongoDBClient.class');
const { APIError, httpStatusCodes } = require('../classes/Error/error');
const logger = require('../utils/loggers');

class ServiceDAOMongoDB extends DAO {
  constructor(nombreColeccion) {
    super();
    this.coleccion = nombreColeccion;
    this.conn = new MongoDBClient();
  }

  mostrarTodos = async () => {
    let response;
    try {
      await this.conn.connect();
      const docs = await this.coleccion.find({});
      if (docs == []) {
        response = [];
      } else {
        response = docs.map((doc) => doc);
      }
      return response;
    } catch (error) {
      const errorCustom = new APIError(
        `Error al obtener mostrar todos`,
        httpStatusCodes.NOT_FOUND,
        true,
        `${error}`
      );
      logger.error(errorCustom);
    } finally {
      this.conn.disconnect();
      logger.info(`Elementos listados ${response.length}`);
    }
  };

  guardar = async (body) => {
    try {
      await this.conn.connect();
      const newObj = this.coleccion.create(body);
      return newObj;
    } catch (error) {
      const errorCustom = new APIError(
        `Error al guardar() ${id}`,
        httpStatusCodes.NOT_FOUND,
        true,
        `${error}`
      );
      logger.error(errorCustom);
    } finally {
     //    this.conn.disconnect();
      logger.info(`Elemento guardado`);
    }
  };

  eliminar = async (condicion, id) => {
    try {
      await this.conn.connect();
      await this.coleccion.deleteOne({ [condicion]: id });
    } catch (error) {
      const errorCustom = new APIError(
        `Error al eliminar id ${id}`,
        httpStatusCodes.NOT_FOUND,
        true,
        `${error}`
      );
      logger.error(errorCustom);
    } finally {
      this.conn.disconnect();
      logger.info(`Elemento elimindado id: ${id}`);
    }
  };

  mostrarId = async (condition, id) => {
    if (condition == 'id' || null) {
      condition = '_id';
    } else {
      condition;
    }

    try {
      await this.conn.connect();
      let doc = await this.coleccion.findOne({ [condition]: id });
      return doc;
    } catch (error) {
      const errorCustom = new APIError(
        `NOT FOUND mostrar id: ${id}`,
        httpStatusCodes.NOT_FOUND,
        true,
        `${error}`
      );
      logger.error(errorCustom);
    } finally {
      this.conn.disconnect();
    }
  };

  existUser = async (email) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.findOne({ email: email });
      console.log('DOC', doc);
      return doc;
    } catch (error) {
      const errorCustom = new APIError(
        `NOT FOUND exist user email: ${id}`,
        httpStatusCodes.NOT_FOUND,
        true,
        `${error}`
      );
      logger.error(errorCustom);
    }
  };

  actualizar = async ( id, body) => {
    try {
      await this.conn.connect();
      console.log(id)
            console.log(body);
      let doc = await this.coleccion.updateOne({_id:id}, 
        { $set: body }
      );
      return doc;
    } catch (error) {
      const errorCustom = new APIError(
        `Error al actualizar: ${id}`,
        httpStatusCodes.NOT_FOUND,
        true,
        `${error}`
      );
      logger.error(errorCustom);
    } finally {
      this.conn.disconnect();
    }
  };
}

module.exports = ServiceDAOMongoDB;
