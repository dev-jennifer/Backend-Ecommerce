import ContenedorFirebase from "../containers/ContenedoFirebase.js";

class ProductosDAOFirebase extends ContenedorFirebase {
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

export default ProductosDAOFirebase;