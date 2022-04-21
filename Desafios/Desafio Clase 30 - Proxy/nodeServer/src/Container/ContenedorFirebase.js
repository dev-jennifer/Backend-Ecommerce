// import config from "../utils/options.js";
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();
/***************FIREBASE*************************/

try {
  admin.initializeApp({
    apiKey: process.env.F_APP_KEY_ID,
    appId: process.env.F_PRIVATE_KEY_ID,
    projectId: process.env.F_PROJECT_ID,
    // credential: admin.credential.cert(process.env.firebase),
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
