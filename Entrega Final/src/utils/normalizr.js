const { normalize, denormalize, normalizr, schema } = require('normalizr');


//Define esquema de autor
 const usuarioSchema = new schema.Entity('email');

 
 const textoSchema = new schema.Entity('mensaje', {}, { 'email': 'email' });

//Define esquema de mensaje
 const schemaMensajes = new schema.Entity('mensajes', {
   email: usuarioSchema,
   mensaje: [textoSchema],
 });



//Normalizo los mensajes
function normalizedHolding(dataObj) {
  const normalizadorMensajes = normalize(dataObj, [schemaMensajes]);
  console.log( normalizadorMensajes );
  return normalizadorMensajes;
}

function deNormalizarMensajes(dataObjNormalizado) {
  const deNormalizarMensajes = denormalize(
    dataObjNormalizado.result,
    schemaMensajes,
    dataObjNormalizado.entities
  );
  return deNormalizarMensajes;
}
module.exports = { normalizedHolding, deNormalizarMensajes };
