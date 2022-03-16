import mongoose from "mongoose";
import config from "../utils/config.js";

const URL = config.mongodb.url;

await mongoose.connect(URL);

class ContenedorMongoDB {
  constructor(nombreColeccion, esquema) {
    this.coleccion = mongoose.model(nombreColeccion, esquema);
  }

  mostrarTodos = async () => {
    try {
      const docs = await this.coleccion.find({});
      return docs;
    } catch (error) {
      this.console.log(error);
      return {
        code: "001",
        msg: "Errror al consumir ",
      };
    }
  };

  guardar = async (body) => {
    try {
      await this.coleccion.create(body);
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
      console.log("delete");
      await this.coleccion.deleteOne({ id: id });
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
      return await this.coleccion.findOne({ id: id });
    } catch (error) {
      console.log(error);

      return {
        code: "003",
        msg: "Error al mostrar",
      };
    }
  };

  mostrarBuyer = async (id) => {
    try {
      return await this.coleccion.findOne({ idBuyer: id });
    } catch (error) {
      console.log(error);

      return {
        code: "003",
        msg: "Error al mostrar",
      };
    }
  };
  // actualizarCart = (idBuyer, cartProduct) => {
  //   try {
  //     let BuyerId = idBuyer;
  //     let cantidad = 1;

  //     this.coleccion.updateOne(
  //       {
  //         buyerId: BuyerId,
  //       },
  //       {
  //         $pull: {
  //           productos: {
  //             idProducto: cartProduct.id,
  //             cantidad: { $gte: cantidad },
  //             nombreProducto: cartProduct.nombreProducto,
  //             precioProducto: cartProduct.precioProducto,
  //           },
  //         },
  //       },

  //       function (err, docs) {
  //         if (err) throw err;
  //         console.log("%s", docs);
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       code: "004",
  //       msg: "Error al actualizar",
  //     };
  //   }
  // };

  actualizar = async (id, body) => {
    try {
      await this.coleccion.updateOne(
        {
          _id: id,
        },

        { $set: body }
      );
      console.log(body);
    } catch (error) {
      console.log(error);
      return {
        code: "004",
        msg: "Error al actualizar",
      };
    }
  };
}
export default ContenedorMongoDB;
