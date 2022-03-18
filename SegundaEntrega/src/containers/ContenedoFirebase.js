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
        const doc =  this.coleccion.doc(`${id}`);
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
        const snapshot = await this.coleccion.get(id);
        let docs = snapshot.docs;
  
        const response = docs.map((doc) => ({
          id: doc.id,
          producto: doc.data()
        }));
        
        return response
      } catch (error) {
        console.log(error);

        return {
          code: "003",
          msg: "Error al mostrar",
        };
      }
    };

  //   mostrarBuyer = async (id) => {
  //     try {
  //       return await this.coleccion.findOne({ idBuyer: id });
  //     } catch (error) {
  //       console.log(error);

  //       return {
  //         code: "003",
  //         msg: "Error al mostrar",
  //       };
  //     }
  //   };

  //   actualizar = async (id, body) => {
  //     try {
  //       await this.coleccion.updateOne(
  //         {
  //           _id: id,
  //         },

  //         { $set: body }
  //       );
  //       console.log(body);
  //     } catch (error) {
  //       console.log(error);
  //       return {
  //         code: "004",
  //         msg: "Error al actualizar",
  //       };
  //     }
  //   };
}
export default ContenedorFirebase;
