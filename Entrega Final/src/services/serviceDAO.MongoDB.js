//const DAO = require('../DAOs/DAO.class');
const APICustom = require('../classes/Error/customError');
const MongoDBClient = require('../classes/MongoDBClient.class');

const logger = require('../utils/loggers');

class ServiceDAOMongoDB {
  constructor(nombreColeccion) {
    this.coleccion = nombreColeccion;
    this.conn = new MongoDBClient();
    this.message = new APICustom();
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
      this.message.errorInternalServer(error, `Error al obtener mostrar todos`);
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
      this.message.errorInternalServer(error, `Error al guardar`);
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
       this.message.errorInternalServer(error,  `Error al eliminar id ${id}`);
         
    } finally {
      this.conn.disconnect();
      logger.info(`Elemento elimindado id: ${id}`);
    }
  };

  mostrarId = async (id) => {
    const client = await this.conn.connect().catch((err) => {
       this.message.errorServer(error, `Error al conectar`);
    });
    if (client) {
      try {
        let doc = await this.coleccion.findOne({ _id: id });
        return doc;
      } catch (error) {
       this.message.errorInternalServer(error, `Error al mostrar id`);
      } finally {
        this.conn.disconnect();
      }
    }
  };

  mostrarEmail = async (email) => {
    const client = await this.conn.connect().catch((err) => {
     this.message.errorServer(error, `Error al conectar`);
    });
    if (client) {
      try {
        let doc = await this.coleccion.findOne({ email: email });
        return doc;
      } catch (error) {
         this.message.errorInternalServer(error, `Error al mostrar email`);
      } finally {
        this.conn.disconnect();
      }
    }
  };

  mostrarByEmail = async (id) => {
    const client = await this.conn.connect().catch((err) => {
       this.message.errorServer(error, `Error al conectar`);
    });
    if (client) {
      try {
        let doc = await this.coleccion.find({ 'usuario.email': { $eq: id } });
        return doc;
      } catch (error) {
        this.message.errorInternalServer(error, `Error al mostrar email por chat`);
      } finally {
        this.conn.disconnect();
      }
    }
  };
 
  mostrarCategoria = async (id) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.find({ categoria: id });
      return doc;
    } catch (error) {
      this.message.errorInternalServer(
        error,
        `Error al mostrar categoria`
      );
    }
  };

  mostrarTodasCategorias = async () => {
    try {
      await this.conn.connect();
      let cat = await this.coleccion.distinct('categoria');
      return cat;
    } catch (error) {
 this.message.errorInternalServer(error, `Error al mostrar todas categorias`);
    } finally {
      this.conn.disconnect();
    }
  };

  actualizar = async (id, body) => {
    const client = await this.conn.connect().catch((err) => {
     this.message.errorServer(error, `Error al conectar`);
 
    });
    if (client) {
      try {
        let doc = await this.coleccion.updateOne({ _id: id }, { $set: body });

        return doc;
      } catch (error) {
        this.message.errorInternalServer(
          error,
          `Error al actualizar`
        );
        return {
          status: 0,
          data: error,
        };
      } finally {
        this.conn.disconnect();
      }
    }
  };

  actualizarChat = async (email, body) => {
    try {
      await this.conn.connect();
 
      let doc = await this.coleccion.updateOne(
        { email: email },
        { $set: body }
      );
      return doc;
    } catch (error) {
           this.message.errorInternalServer(error, `Error al actualizar`);
    } finally {
      this.conn.disconnect();
    }
  };
}

module.exports = ServiceDAOMongoDB;
