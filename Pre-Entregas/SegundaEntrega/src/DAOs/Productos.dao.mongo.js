import ContenedorMongoDB from "../containers/ContenedorMongoDb.js";

class ProductosDAO extends ContenedorMongoDB {
  constructor() {
    super("productos", {
      nombreProducto: { type: String, require: true },
      descripcion: { type: String, require: false },
      precioProducto: { type: Number, require: true },
      fotoProducto: { type: String, require: false },
      codigo: { type: String, require: false },
      stock: { type: Number, require: true }
    });
  }
}

export default ProductosDAO;