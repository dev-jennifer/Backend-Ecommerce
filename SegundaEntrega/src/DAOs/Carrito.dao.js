import ContenedorMongoDB from "../containers/ContenedorMongoDb.js";

class CarritoDAO extends ContenedorMongoDB {
  constructor() {
    super("carrito", {
    BuyerID: { type: Number, require: true },
    Fecha: { type: Date, require: false },
    Productos: { type: String, require: false },
    });
  }
}

export default CarritoDAO;
