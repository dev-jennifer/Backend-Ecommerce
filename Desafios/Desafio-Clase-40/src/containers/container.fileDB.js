const logger=require("../../logger.js")
const fs = require('fs').promises;
const CustomError = require('../classes/CustomError.class');
class ContainerFile {
  constructor(file) {
    this.ruta = file;
 
  }
  mostrarTodos = async () => {
  try {
      const content = await fs.readFile(this.ruta, "utf8");
      const arr = JSON.parse(content);
      return arr;
    } catch (error) {
      logger.error(error);
      return [];
    }
  };

  guardar = async (obj) => {
    const objs = await this.mostrarTodos();
    const newObj = { ...obj };
    objs.push(newObj);
    console.log(objs);
    try {
      fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
      return newObj;
    } catch (error) {
      const detailError = new CustomError(500, 'Error al guardar', error);
      logger.error(detailError);
    }
  };
};

eliminar = async (condicion, id) => {
  try {
    const objs = await this.mostrarTodos();
    const index = objs.findIndex((o) => o.id == id);
    if (index == -1) {
      throw new Error(`Error al borrar: no se encontró el id ${id}`);
    }

    objs.splice(index, 1);
    try {
      await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  } catch (error) {
    return {
      code: '003',
      msg: 'Error al eliminar',
    };
  }
};

mostrarId = async (condition, id) => {
  try {
    const objs = await this.listarAll();
    const doc = objs.find((o) => o.id == id);
    return doc;
  } catch (error) {
    console.log(error);

    return {
      code: '004',
      msg: 'Error al mostrar',
    };
  }
};

existUser = (email) => {
  try {
    let doc = this.coleccion.findOne({ email: email });
    return doc;
  } catch (error) {
    console.log(error);

    return {
      code: '005',
      msg: 'Error al mostrar',
    };
  }
};

actualizar = async (condition, id, body) => {
  try {
    await this.coleccion.updateOne(
      {
        buyerID: id,
      },

      { $set: body }
    );
    console.log('OK');
  } catch (error) {
    console.log(error);
    return {
      code: '006',
      msg: 'Error al actualizar',
    };
  }
};

module.exports = ContainerFile;