const knexLib = require("knex");
class Productos {
  constructor(options) {
    this.knex = knexLib(options);
  }
 
  guardar(articulos) {
    console.log(articulos)
    return this.knex("productos").insert(articulos);

  }

  mostrarTodos() {
    return this.knex.from("productos").select("*");
  }
  eliminar(id) {
    return this.knex.from("productos").where("id", id).del();
  }

  mostrarId(id) {
    return this.knex.from("productos").where("id", id);
  }

  actualizar(condicion , parametros) {
 
    return this.knex.from('productos').where("id", condicion).update(parametros);
}
cerrarConexion() {
  this.knex.destroy();
}
 

}
module.exports = Productos;
