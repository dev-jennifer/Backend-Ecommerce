const mongoose = require("mongoose");
// const dotenv = require( 'dotenv');
// dotenv.config({ silent: process.env.NODE_ENV === 'production' });

// const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env
// 	.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME_USER}?retryWrites=true&w=majority`;

const {MONGO_URI} = require("../utils/config")
class ContenedorMongoDB {
  constructor(nombreColeccion, esquema) {
    mongoose.connect(MONGO_URI);
    this.coleccion = mongoose.model(nombreColeccion, esquema);
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
    const newObj =     this.coleccion.create(body);
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

  existUser = async (email) => {
    try {
      let doc = await this.coleccion.findOne({ email: email });
      return doc;
    } catch (error) {
      console.log(error);

      return {
        code: '005',
        msg: 'Error al mostrar',
      };
    }
  };
  // mostrarBuyer = async (id) => {
  //   try {
  //     return await this.coleccion.findOne({ buyerID: id });
  //   } catch (error) {
  //     console.log(error);

  //     return {
  //       code: "003",
  //       msg: "Error al mostrar",
  //     };
  //   }
  // };

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
  actualizar = async (condition, id, body) => {
    try {
      await this.coleccion.updateOne(
        {
          [condition]: id,
        

         $set: body }
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
module.exports= ContenedorMongoDB;
