import admin from "firebase-admin";
import config from "../utils/config.js";

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
      let docs = snapshot.docs;

      const response = docs.map((doc) => ({
        id: doc.id,
        producto: doc.data(),
      }));
      return response;
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

  eliminar = async (id) => {
    try {
      const doc = this.coleccion.doc(`${id}`);
      let item = await doc.delete();
      console.log("El usuario ha sido borrado", item);
    } catch (error) {
      console.log(error);
      return {
        code: "003",
        msg: "Error al eliminar",
      };
    }
  };

  mostrarId = async (id) => {
    try {
      const itemId = await this.coleccion.doc(id).get();

      let data = {
        id,
        ...itemId.data(),
      };

      return data;
    } catch (error) {
      console.log(error);

      return {
        code: "003",
        msg: "Error al mostrar",
      };
    }
  };


  actualizar = async (id, body) => {
    try {
      const doc = await this.coleccion.doc(id).update(body);
      console.log("producto actualizado");
    } catch (error) {
      console.log(error);
      return {
        code: "004",
        msg: "Error al actualizar",
      };
    }
  };
 

  // mostrarBuyer = async (id) => {
  //   try {
  //     const response = await this.coleccion.where("buyerID", "==", id).get();
  //     const documents = [];
  //     response.forEach((doc) => {
  //       const document = doc.data();
  //       documents.push(document);
  //     });
  //     return documents;
  //   } catch (error) {
  //     console.log(error);

  //     return {
  //       code: "003",
  //       msg: "Error al mostrar",
  //     };
  //   }
  // };
}

export default ContenedorFirebase;
