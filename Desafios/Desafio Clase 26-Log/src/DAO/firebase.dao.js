import ContenedorFirebase from "../Container/ContenedorFirebase.js";

class MensajesDAO extends ContenedorFirebase {
  constructor() {
    super("mensajes");
  }
}

export default MensajesDAO;