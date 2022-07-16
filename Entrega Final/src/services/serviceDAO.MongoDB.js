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
      //   this.conn.disconnect();
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
      return await this.coleccion.deleteOne({ [condicion]: id });
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

  mostrarId = async (id) => {
    const client = await this.conn.connect().catch((err) => {
      console.log('Error while connecting to db', err);
    });
    if (client) {
      try {
        let doc = await this.coleccion.findOne({ _id: id });
        return doc;
      } catch (error) {
        console.log('Error while fetching single record::', error);
     
      } finally {
        this.conn.disconnect();
      }
    }
  };

  // mostrarId = async (id) => {
  //   return await this.conn
  //     .connect()
  //     .then(() => {
  //       return this.coleccion.findOne({ _id: id });
  //     })

  //     .catch((error) => {
  //       const errorCustom = new APIError(
  //         `NOT FOUND mostrar id: ${id}`,
  //         httpStatusCodes.NOT_FOUND,
  //         true,
  //         `${error}`
  //       );
  //       logger.error(errorCustom);
  //     })
  //     .finally(() => {
  //       this.conn.disconnect();
  //     });
  // };

  mostrarCategoria = async (id) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.find({ categoria: id });
      return doc;
    } catch (error) {
      const errorCustom = new APIError(
        `NOT FOUND mostrar id: ${id}`,
        httpStatusCodes.NOT_FOUND,
        true,
        `${error}`
      );
      logger.error(errorCustom);
    }
  };

  mostrarTodasCategorias = async () => {
    try {
      await this.conn.connect();
      let cat = await this.coleccion.distinct('categoria');
      return cat;
    } catch (error) {
      console.log(error);
    } finally {
      this.conn.disconnect();
    }
  };

  actualizar = async (id, body) => {
    const client = await this.conn.connect().catch((err) => {
      return new APIError(
        `Error al actualizar: ${id}`,
        httpStatusCodes.NOT_FOUND,
        true,
        `${err}`
      );
    });
    if (client) {
      try {
        let doc = await this.coleccion.updateOne({ _id: id }, { $set: body });

        return doc;
      } catch (error) {
        console.log('Error while fetching single record::', error);
        return {
          status: 0,
          data: error,
        };
      } finally {
        this.conn.disconnect();
      }
    }
  };
  
 

  // actualizarCart = async (buyerID, body) => {
  //   try {
  //     await this.conn.connect();
  //     console.log(id);
  //     console.log(body);
  //     let doc = await this.coleccion.updateOne(
  //       { buyerID: buyerID },
  //       { $set: body }
  //     );
  //     return doc;
  //   } catch (error) {
  //     const errorCustom = new APIError(
  //       `Error al actualizar buyerID: ${buyerID}`,
  //       httpStatusCodes.NOT_FOUND,
  //       true,
  //       `${error}`
  //     );
  //     logger.error(errorCustom);
  //   } finally {
  //     this.conn.disconnect();
  //   }
  // };
}

module.exports = ServiceDAOMongoDB;
