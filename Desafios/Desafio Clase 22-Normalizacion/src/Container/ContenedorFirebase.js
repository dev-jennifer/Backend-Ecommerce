import config from "../utils/options.js";
import admin from "firebase-admin";

/***************FIREBASE*************************/
try {
  admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
  });
} catch (error) {
  console.log(error);
} finally {
  console.log("base Firebase conectada!");
}
const db = admin.firestore();

class ContenedorFirebase {
  constructor(nombreColeccion) {
    this.coleccion = db.collection(nombreColeccion);
  }

  mostrarTodos = async () => {
    try {
      const snapshot = await this.coleccion.get();
      const docs = snapshot.docs;
      const response = docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
   

      let arrayMensajes = { id: "mensajes", mensajes: response };
      return arrayMensajes;
 
    } catch (error) {
      console.log(error);
      return {
        code: "001",
        msg: "Errror al consumir ",
      };
    }
  };

  guardar = async (body) => {
    try {
      let doc = this.coleccion.doc();
      await doc.create(body);

      return {
        msg: "Elemento guardado!",
      };
    } catch (error) {
      console.log(error);
      return {
        code: "002",
        msg: "Error al guardar",
      };
    }
  };
}

export default ContenedorFirebase;
