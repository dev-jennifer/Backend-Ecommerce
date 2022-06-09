const MongoDBClient = require('../classes/MongoDBClient.class');
const logger = require('../utils/loggers');
class ContenedorMongoDB {
  constructor(nombreColeccion) {
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
      const cuserr = new CustomError(500, 'Error al mostrarTodos()', error);
      logger.error(cuserr);
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
      const cuserr = new CustomError(500, 'Error al guardar()', error);
      logger.error(cuserr);
      throw cuserr;
    } finally {
      logger.info(`Elemento guardado`);
    }
  };

  eliminar = async (condicion, id) => {
    try {
      await this.conn.connect();
      await this.coleccion.deleteOne({ [condicion]: id });
    } catch (error) {
      const cuserr = new CustomError(500, 'Error al eliminar()', error);
      logger.error(cuserr);
      throw cuserr;
    } finally {
      this.conn.disconnect();
      logger.info(`Elemento elimindado id: ${id}`);
    }
  };

  mostrarId = async (condition, id) => {
    condition ? '_id' : condition;
    try {
      await this.conn.connect();
      let doc = await this.coleccion.findOne({ [condition]: id });
      return doc;
    } catch (error) {
      const cuserr = new CustomError(500, 'Error al mostrarId()', error);
      logger.error(cuserr);
      throw cuserr;
    } finally {
      this.conn.disconnect();
      logger.info(`MostrarId: ${id}`);
    }
  };

  existUser = async (email) => {
    try {
      await this.conn.connect();
      let doc = this.coleccion.findOne({ email: email });
      return doc;
    } catch (error) {
      const cuserr = new CustomError(500, 'Error al mostrarId()', error);
      logger.error(cuserr);
      throw cuserr;
    } finally {
      this.conn.disconnect();
    }
  };

  actualizar = async (condition, id, body) => {

     try {
      await this.conn.connect();
     let doc= await this.coleccion.updateOne(
        {
        [condition]: id,
         $set: body }
      );
      console.log(doc);
    }    catch (error) {
        throw new Error(`Error al actualizar: ${error}`);
      }finally {
      this.conn.disconnect();
    }
    }
  };
 
module.exports = ContenedorMongoDB;
