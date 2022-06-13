const DAO = require('../../classes/DAO.class');
const logger = require('../../utils/loggers');
class ServiceDAOMemory extends DAO {
  constructor() {
    super();
    this.colecction = [];
  }

  async mostrarTodos() {
    let docs = [];

    try {
      docs = this.colecction;
      return docs;
    } catch (error) {
      throw new Error(`Error al listarAll() ${error}`);
    } finally {
      logger.info(`Elementos listados ${docs.length}`);
    }
  }

  async mostrarId(condition, id) {
    let elem = null;
    console.log(`Elemento ${id}, condicion ${condition}`);

    try {
      elem = this.colecction.find((elem) => {
        return elem[condition] == id;
      });

      console.log(elem);
      return elem;
    } catch (error) {
      throw new Error(`Error al listar(id) ${error}`);
    }
  }

  async guardar(elemento) {
    try {
      let nuevoId;

      const listMemory = await this.mostrarTodos();

      if (listMemory.length === 0) {
        nuevoId = 1;
      } else {
        nuevoId = listMemory.length + 1;
      }
      const newElement = { id: nuevoId, ...elemento };

      this.colecction.push(newElement);
      return newElement;
    } catch (error) {
      throw new Error(`Error al guardar() ${error}`);
    } finally {
      logger.info(`Elemento guardado  `);
    }
  }

  existUser = async (email) => {
    try {
      let doc = this.colecction.findIndex((x) => x['email'] == email);

      doc == -1 ? (doc = null) : doc;
    console.log("DOC",doc)
      return doc;
    } catch (error) {
      throw new Error(`Error al mostrarId() ${error}`);
    }
  };

  async actualizar(condition, id, body) {
    let doc = null;
    try {
      const index = this.colecction.findIndex((x) => x[condition] == id);

      if (index == -1) {
        doc = { code: 401, msg: 'Producto no encontrado' };
      } else {
        doc = { id: id, ...body };
        this.colecction[index] = doc;
      }

      logger.info(`Elemento modificado `);
      return doc;
    } catch (error) {
      throw new Error(`Error al actualizar() ${error}`);
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
      throw new Error(`Error al eliminar()   ${error}`);
    } finally {
      logger.info(`Elemento eliminado`);
    }
  }
}

module.exports = ServiceDAOMemory;
