const CustomError = require('../classes/CustomError.class');
const logger = require('../utils/loggers');
class ContainerMemory {
  constructor() {
    this.colecction = [];
  }

  async mostrarTodos() {
    let docs = [];

    try {
      docs = this.colecction;
      console.log(docs);
      return docs;
    } catch (error) {
      const cuserr = new CustomError(500, 'Error al listarAll()', error);
      logger.error(cuserr);
      throw cuserr;
    } finally {
      logger.info(`Elementos listados ${docs.length}`);
    }
  }

  async mostrarId(condition, id) {
    let elem = null;

    try {
      elem = this.colecction.find((elem) => {
        return elem[condition] == id;
      });

      console.log(elem);
      return elem;
    } catch (error) {
      const cuserr = new CustomError(500, 'Error al listar(id)', error);
      logger.error(cuserr);
      throw cuserr;
    }
  }

  async guardar(elemento) {
    try {
      let nuevoId;
      let doc = null;

      const listMemory = await this.mostrarTodos();
      if (listMemory.length === 0) {
        nuevoId = 1;
      } else {
        nuevoId = listMemory.length + 1;
      }
      const newElement = { id: nuevoId, ...elemento };

      console.log(newElement);
      this.colecction.push(newElement);
      return newElement;
    } catch (error) {
      const cuserr = new CustomError(500, 'Error al guardar()', error);
      logger.error(cuserr);
      throw cuserr;
    } finally {
      logger.info(`Elemento guardado  `);
      console.log(this.colecction);
    }
  }

  existUser = async (email) => {
    try {
      let doc = this.colecction.findIndex((x) => x['email'] == email);
 
 doc==-1?doc=null:doc

      return doc;
    
    } catch (error) {
      const cuserr = new CustomError(500, 'Error al mostrarId()', error);
      logger.error(cuserr);
      throw cuserr;
    }
  };

  async actualizar(condition, id, body) {
    let doc = null;
    try {
      const index = this.colecction.findIndex((x) => x[condition] == id);
      console.log(index);
      if (index == -1) {
        doc = { code: 401, msg: 'Producto no encontrado' };
      } else {
        doc = { id: id, ... body };
        this.colecction[index] = doc;
        console.log(this.colecction);
      }

      logger.info(`Elemento modificado `);
      return doc;
    } catch (error) {
      const cuserr = new CustomError(500, 'Error al actualizar()', error);
      logger.error(cuserr);
      throw cuserr;
    }
  }

 

  async eliminar(condicion, id) {
    let doc = null;

    try {
      const index = this.colecction.findIndex((elem) => elem[condicion] == id);
      console.log(index);
      if (index == -1) {
        doc = { code: 401, msg: 'ID no encontrado' };
      } else {
        doc = this.colecction.splice(index, 1);
      }

      return doc;
    } catch (error) {
      const cuserr = new CustomError(500, 'Error al eliminar()', error);
      logger.error(cuserr);
      throw cuserr;
    } finally {
      logger.info(`Elemento eliminado`);
    }
  }
}

module.exports = ContainerMemory;
