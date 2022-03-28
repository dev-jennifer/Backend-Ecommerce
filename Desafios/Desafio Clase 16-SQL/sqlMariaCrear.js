const { options } = require("./src/utils/options");
const knex = require("knex");
const sqlMariaClient= knex(options.mariaDB);
try {
    sqlMariaClient.schema.dropTableIfExists("productos")
    .createTable("productos", (table) => {
          table.increments("id").primary();
          table.string("nombreProducto", 50).notNullable();
          table.string("descripcion", 300).notNullable();
          table.string("fotoProducto", 350).notNullable();
          table.string("codigo", 15)
          table.float("precioProducto");
          table.integer("stock");
          
        })
      .finally(() => sqlMariaClient.destroy())
} catch (error) {
  console.log(error);
}
