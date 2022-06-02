const MongoDBClient = require('../classes/MongoDBClient.class');

class ContenedorMongoDB {
  constructor(nombreColeccion) {
    this.coleccion = nombreColeccion;
    this.conn = new MongoDBClient();
  }

  mostrarTodos = async () => {
    try {
      await this.conn.connect();
      const docs = await this.coleccion.find({});
      const response = docs.map((doc) => ({
        id: doc._id,
        producto: doc,
      }));
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
      this.conn.disconnect();
      logger.info(`Elemento guardado ${body}`);
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

  existUser =async (email) => {
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
    
    const objs = await this.mostrarTodos();
    const index = objs.findIndex((o) => o.id == id);
    if (index == -1) {
      throw new Error(`Error al actualizar: no se encontró el id ${id}`);
    } else {
      objs[index] = elem;
      try {

        await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
      } catch (error) {
        throw new Error(`Error al actualizar: ${error}`);
      }
    }
  };
}
module.exports = ContenedorMongoDB;
