const DAO = require('../../classes/DAO.class');
const MongoDBClient = require('../../classes/MongoDBClient.class');
const logger = require('../../utils/loggers');

class ServiceDAOMongoDB extends DAO {
  constructor(nombreColeccion) {
    super();
    this.coleccion = nombreColeccion;
    this.conn = new MongoDBClient();
  }

  mostrarTodos = async () => {
    let response;
    try {
      await this.conn.connect()
  const docs = await this.coleccion.find({})  
  if (docs == []) {
        response = [];
      } else {
        response = docs.map((doc) => doc);
      }
    return response;
  
    } catch (error) {
      logger.error(`Error al obtener mostrar todos`);
 
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
      throw new Error(`Error al guardar() ${error}`);
    } finally {
      logger.info(`Elemento guardado`);
    }
  };

  eliminar = async (condicion, id) => {
    try {
      await this.conn.connect();
      await this.coleccion.deleteOne({ [condicion]: id });
    } catch (error) {
      throw new Error(`Error al eliminar() ${error}`);
    } finally {
      this.conn.disconnect();
      logger.info(`Elemento elimindado id: ${id}`);
    }
  };

  mostrarId = async (condition, id) => {
    let value = condition;

    if (value == 'id' || null) {
      value = '_id';
    } else {
      value;
    }

    try {
      await this.conn.connect();
      let doc = await this.coleccion.findOne({ [value]: id });
      return doc;
    } catch (error) {
      throw new Error(`Error al mostrarId() ${error}`);
    } finally {
      logger.info(`MostrarId: ${id}`);
      //this.conn.disconnect();
    }
  };

  existUser = async (email) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.findOne({ email: email });
      console.log('DOC', doc);
      return doc;
    } catch (error) {
      const cuserr = new CustomError(500, 'Error al mostrarId()', error);
      logger.error(cuserr);
      throw cuserr;
    }
  };

  actualizar = async (condition, id, body) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.updateOne(
        {
          [condition]: id,
        },
        { $set: body }
      );
      return doc;
    } catch (error) {
      throw new Error(`Error al actualizar: ${error}`);
    } finally {
      this.conn.disconnect();
    }
  };
}

module.exports = ServiceDAOMongoDB;
