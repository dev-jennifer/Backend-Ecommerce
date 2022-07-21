const APICustom = require('../classes/Error/customError');
const MongoDBClient = require('../classes/MongoDBClient.class');

class ServiceDAOMongoDB {
  constructor(nombreColeccion) {
    this.coleccion = nombreColeccion;
    this.conn = new MongoDBClient();
    this.message = new APICustom();
  }


  mostrarTodos = async () => {
    let response;
    try {
      await this.conn.connect();
      const docs = await this.coleccion.find({});
      if (docs == []) {
        response = [];
      } else {
        response = docs.map((doc) => doc);
      }
      this.message.infoSimple(`****Elemento listados ${response.length}****`);
      return response;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al obtener mostrar todos`);
    } finally {
      //   this.conn.disconnect();
    }
  };

  guardar = async (body) => {
 
    try {
      await this.conn.connect();
      const newObj = await this.coleccion.create(body);
      return newObj;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al guardar`);
    } finally {
       this.message.infoSimple('****Elemento guardado****');
      //    this.conn.disconnect();
    }
  };


  eliminar = async (condicion, id) => {
    try {
      await this.conn.connect();
      const elemento = await this.coleccion.deleteOne({ [condicion]: id });
      this.message.infoSimple(`Elemento elimindado id: ${id}`);

      return elemento;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al eliminar id ${id}`);
    } finally {
   //   this.conn.disconnect();
    }
  };

  mostrarId = async (id) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.findOne({ _id: id });
      this.message.infoSimple('****Mostrar por ID****');
      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al mostrar id`);
    } finally {
    //  this.conn.disconnect();
    }
  };

  mostrarEmail = async (email) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.findOne({ email: email });
      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al mostrar email`);
 
    } finally {
      this.message.infoSimple('****Mostrar por Email****');
    //  this.conn.disconnect();
    }
  };

  mostrarByEmail = async (id) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.find({ 'usuario.email': { $eq: id } });

      this.message.infoSimple('****Mostrar por Email CHAT****');
         
      return doc;
    } catch (error) {
      this.message.errorInternalServer(
        error,
        `Error al mostrar email por chat`
        
      );
      
    }  finally{
 //       this.conn.disconnect();
    }
  };

  mostrarCategoria = async (id) => {
    try {
      await this.conn.connect();
      let doc = await this.coleccion.find({ categoria: id });
      this.message.infoSimple('****Se muestran por categoria****');
      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al mostrar categoria`);
    }
  };

  mostrarTodasCategorias = async () => {
    try {
      await this.conn.connect();
      let cat = await this.coleccion.distinct('categoria');
      this.message.infoSimple('****Se muestran todas las categorias****');
      return cat;
    } catch (error) {
      this.message.errorInternalServer(
        error,
        `Error al mostrar todas categorias`
      );
    } finally {
  //    this.conn.disconnect();
    }
  };

  actualizar = async (id, body) => {
    try {
      await this.conn.connect();

      let doc = await this.coleccion.updateOne({ _id: id }, { $set: body });

      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al actualizar`);
    } finally {
         this.message.infoSimple('****Actualizado Exitoso****');
    //   this.conn.disconnect();
    }
  };

  actualizarPorEmail = async (email, body) => {
    try {
      await this.conn.connect();

      let doc = await this.coleccion.updateOne(
        { email: email },
        { $set: body }
      );
      this.message.infoSimple('****Actualizado Exitoso****');
      return doc;
    } catch (error) {
      this.message.errorInternalServer(error, `Error al actualizar`);
    } finally {
 //     this.conn.disconnect();
    }
  };
}

module.exports = ServiceDAOMongoDB;
