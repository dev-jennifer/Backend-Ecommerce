const { options } = require("./src/utils/options");
const knexLib = require("knex");

knexLib(options).crearTabla(() => {
  return knexLib.schema.dropTableIfExists("mensajes").then(() => {
    return knexLib.schema
      .createTable("mensajes", (table) => {
        table.increments("id").primary();
        table.string("autor", 50);
        table.string("texto", 200);
        table.string("fechaHora", 50);
      })
      .finally(() => {
        knexLib.destroy();
      });
  });
});
