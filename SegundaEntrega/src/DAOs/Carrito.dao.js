import ContenedorMongoDB from "../containers/ContenedorMongoDb.js";

class CarritoDAO extends ContenedorMongoDB {
  constructor() {
    super("carrito", {
      BuyerID: { type: String, require: true },
      Fecha: { type: Date, require: true },
      Productos: {
        type: Array,
      },
    });
  }
}

export default CarritoDAO;
