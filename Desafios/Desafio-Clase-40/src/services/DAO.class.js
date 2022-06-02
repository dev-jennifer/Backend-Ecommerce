const CustomError =require('../classes/CustomError.class')

class DAO {
  async mostrarTodos() {
    throw new CustomError(500, "Falta implementar 'mostrarTodos' en Sub Clase");
  }

  async guardar() {
    throw new CustomError(500, "Falta implementar 'guardar' en Sub Clase");
  }

  async eliminar() {
    throw new CustomError(500, "Falta implementar 'eliminar' en Sub Clase");
  }

  async mostrarId() {
    throw new CustomError(500, "Falta implementar 'mostrarId' en Sub Clase");
  }

  async existUser() {
    throw new CustomError(500, "Falta implementar 'existUser' en Sub Clase");
  }

  async actualizar() {
    throw new CustomError(500, "Falta implementar 'actualizar' en Sub Clase");
  }
}

module.exports= DAO;
