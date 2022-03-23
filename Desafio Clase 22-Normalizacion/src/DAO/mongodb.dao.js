import ContenedorMongoDB from "./../Container/ContenedorMongoDB.js";

class MensajesDao extends ContenedorMongoDB {
  constructor() {
    super("mensajes", {
      author: {
        id: { type: String, require: true },
        nombre: { type: String, require: true },
        apellido: { type: String, require: false },
        edad: { type: Number, require: false },
        alias: { type: String, require: false },
        avatar: { type: String, require: false },
      },
      text: { type: String, require: true },
      date: { type: String, require: false },
    });
  }
}

export default MensajesDao;
