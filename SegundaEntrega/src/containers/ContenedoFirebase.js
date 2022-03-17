import admin from "firebase-admin"
const db = admin.firestore();
 
class ContenedorFirebase {
  constructor(nombreColeccion) {
    this.coleccion = db.collection(nombreColeccion);
  }

//   mostrarTodos = async () => {
//     try {
//       const docs = await this.coleccion.find({});
//       return docs;
//     } catch (error) {
//       this.console.log(error);
//       return {
//         code: "001",
//         msg: "Errror al consumir ",
//       };
//     }
//   };

//   guardar = async (body) => {
//     try {
//       await this.coleccion.create(body);
//     } catch (error) {
//       console.log(error);
//       return {
//         code: "002",
//         msg: "Error al guardar",
//       };
//     }
//   };

//   eliminar = async (id) => {
//     try {
//       console.log("delete");
//       await this.coleccion.deleteOne({ id: id });
//     } catch (error) {
//       console.log(error);
//       return {
//         code: "003",
//         msg: "Error al eliminar",
//       };
//     }
//   };

//   mostrarId = async (id) => {
//     try {
//       return await this.coleccion.findOne({ id: id });
//     } catch (error) {
//       console.log(error);

//       return {
//         code: "003",
//         msg: "Error al mostrar",
//       };
//     }
//   };

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
