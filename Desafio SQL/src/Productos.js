const knexLib = require("knex");
class Productos {
  constructor(options) {
    this.knex = knexLib(options);
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists("productos").finally(() => {
      return this.knex.schema.createTable("productos", (table) => {
        table.increments("id").primary();
        table.string("nombreProducto", 50).notNullable();
        table.string("descripcion", 100).notNullable();
        table.string("fotoProducto", 50).notNullable();
        table.string("codigo", 15).notNullable();
        table.float("precioProducto");
        table.integer("stock");
      });
    });
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
    console.log("id",condicion)
    return this.knex.from('productos').where("id", condicion).update(parametros);
}
cerrarConexion() {
  this.knex.destroy();
}
 

}
module.exports = Productos;
