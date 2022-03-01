const knexLib = require("knex");
class Chat {
  constructor(options) {
    this.knex = knexLib(options);
  }

  async guardar(nuevoMensaje) {
    return this.knex("mensajes").insert(nuevoMensaje);
  }

  async mostrarTodos() {
    return this.knex.from("mensajes").select("*");
  }


  cerrarConexion() {
    this.knex.destroy();
  }
}

module.exports = Chat;
