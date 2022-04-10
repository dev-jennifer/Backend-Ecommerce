import { normalize, schema } from "normalizr";

const schemaAuthor = new schema.Entity(
  "author",
  {},
  { idAttribute: "id_email" }
);


const schemaMensaje = new schema.Entity(
  "post",
  { author: schemaAuthor } 
);


const schemaMensajes = new schema.Entity("posts", {
  mensajes: [schemaMensaje],
});

//Normalizo los mensajes
function normalizedHolding(dataObj) {
  const normalizadorMensajes = normalize(dataObj, schemaMensajes);
  return normalizadorMensajes;
}

export { normalizedHolding };
