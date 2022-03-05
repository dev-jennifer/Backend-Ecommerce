const { options } = require("./src/utils/options");
const knex = require("knex");
const sqlLiteClient = knex(options.sqlite2);
try {
  sqlLiteClient.schema.createTable("mensajes", (table) => {
        table.increments("id").primary();
        table.string("autor", 50);
        table.string("texto", 200);
        table.string("fechaHora", 50);
      })
      .then(() => console.log("Tabla creada"))
      .finally(() => sqlLiteClient.destroy());

} catch (error) {
  console.log(error);
}
