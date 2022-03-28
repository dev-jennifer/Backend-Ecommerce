import ContenedorFirebase from "../containers/ContenedoFirebase.js";

class ProductosDAO extends ContenedorFirebase {
  constructor() {
    super("productos");
  }
}

export default ProductosDAO;