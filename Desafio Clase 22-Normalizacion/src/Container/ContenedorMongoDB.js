import mongoose from "mongoose";
import config from "../utils/options.js";
const URL = config.mongodb.url;
await mongoose.connect(URL);

class ContenedorMongoDB {
  constructor(nombreColeccion, esquema) {
    this.coleccion = mongoose.model(nombreColeccion, esquema);
  }
  mostrarTodos = async () => {
    try {
      const docs = await this.coleccion.find({});
      // const response = docs.map((doc) => ({
      //   author: doc.author,
      //   text: doc.text,
      // }));
      return docs;
    } catch (error) {
      this.console.log(error);
      return {
        code: "001",
        msg: "Errror al consumir ",
      };
    }
  };

  guardar = async (body) => {
    try {
      await this.coleccion.create({ author: body, mensaje: body.mensaje });
    } catch (error) {
      console.log(error);
      return {
        code: "002",
        msg: "Error al guardar",
      };
    }
  };
}

export default ContenedorMongoDB;
