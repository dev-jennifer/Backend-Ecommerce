const mongoose = require('mongoose'),
  CONFIG = require('../utils/config');

  mongoose.connect(CONFIG.MONGO_DB.MONGO_URI);
class ContenedorMongoDB {
  constructor(nombreColeccion) {
  
    this.coleccion = nombreColeccion;
  }

  mostrarTodos = async () => {
    try {
      const docs = await this.coleccion.find({});
      const response = docs.map((doc) => ({
        id: doc._id,
        producto: doc,
      }));
      return response;
    } catch (error) {
      this.console.log(error);
      return {
        code: '001',
        msg: 'Errror al consumir ',
      };
    }
  };

  guardar = async (body) => {
    try {
      const newObj = this.coleccion.create(body);
      return newObj;
    } catch (error) {
      console.log(error);
      return {
        code: '002',
        msg: 'Error al guardar',
      };
    }
  };

  eliminar = async (condicion, id) => {
    try {
      await this.coleccion.deleteOne({ [condicion]: id });
    } catch (error) {
      return {
        code: '003',
        msg: 'Error al eliminar',
      };
    }
  };

  mostrarId = async (condition, id) => {
    try {
      let doc = await this.coleccion.findOne({ [condition]: id });
      return doc;
    } catch (error) {
      console.log(error);

      return {
        code: '004',
        msg: 'Error al mostrar',
      };
    }
  };

  existUser =   (email) => {
    try {
      let doc =   this.coleccion.findOne({ email: email });
      return doc;
    } catch (error) {
      console.log(error);

      return {
        code: '005',
        msg: 'Error al mostrar',
      };
    }
  };

  actualizar = async (condition, id, body) => {
    try {
      await this.coleccion.updateOne(
        {
          buyerID: id,
        },

        { $set: body }
      );
      console.log('OK');
    } catch (error) {
      console.log(error);
      return {
        code: '006',
        msg: 'Error al actualizar',
      };
    }
  };
  
}
module.exports = ContenedorMongoDB;
