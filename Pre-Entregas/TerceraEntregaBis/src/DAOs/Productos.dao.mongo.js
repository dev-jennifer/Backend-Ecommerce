const ContenedorMongoDB =require("../containers/ContenedorMongoDb.js");


class ProductosDAO extends ContenedorMongoDB {
  constructor() {
    super("productos", {
      nombre: { type: String, require: true },
      descripcion: { type: String, require: false },
      precio: { type: Number, require: true },
      foto: { type: String, require: false },
      codigo: { type: String, require: false },
      stock: { type: Number, require: true }
    });
  }
}
module.exports=ProductosDAO
