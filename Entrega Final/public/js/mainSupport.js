const socket = io.connect();
function enviarMensaje() {
  const email = document.querySelector('#email');
  const nombre = document.querySelector('#nombre');
  const texto = document.querySelector('#textoMensaje');

  const date = new Date();
  const dateStr =
    ('00' + (date.getMonth() + 1)).slice(-2) +
    '/' +
    ('00' + date.getDate()).slice(-2) +
    '/' +
    date.getFullYear() +
    ' ' +
    ('00' + date.getHours()).slice(-2) +
    ':' +
    ('00' + date.getMinutes()).slice(-2) +
    ':' +
    ('00' + date.getSeconds()).slice(-2);

  socket.emit('mensajeNuevo', {
    usuario: {
      email: email.value,
      nombre: nombre.value,
    },

    tipo: 'usuario',
    textoMsj: texto.value,
    fecha: dateStr,
  });
}

// const autorSchema = new normalizr.schema.Entity('email');
// const textoSchema = new normalizr.schema.Entity(
//   'mensaje',
//   {},
//   { idAttribute: autorSchema }
// );

// //Define esquema de mensaje
// const schemaMensajes = new normalizr.schema.Entity('mensajes', {
//   autor: autorSchema,
//   mensaje: textoSchema,
// });

socket.on('mensajes', (data) => {
  // const denormalizedHolding = normalizr.denormalize(
  //   normalizedHolding.result,
  //   schemaMensajes,
  //   normalizedHolding.entities
  // );
  console.log('test', data);
  let constMensajeHtml = '';

  data.mensajes.map((msg) => {
    constMensajeHtml += `
        <span style="color:blue;">
        <b>${msg.usuario.email}</b></span>
        <b>${msg.usuario.nombre}</b></span>
        <span style="color:brown";>${msg.textoMsj}</span>
            <span style="color:brown";>${msg.tipo}</span>
        <span style="color:green; font-style:italic";>${msg.fecha}</span>
 
        <br>
       `;
  });
  document.getElementById('contenedorMensaje').innerHTML = constMensajeHtml;
});

// function enviarMensaje() {
// console.log("EJEU¡C")
//   const email = document.querySelector('#email');
//   const texto = document.querySelector('#textoMensaje');

//   const date = new Date();
//   const dateStr =
//     ('00' + (date.getMonth() + 1)).slice(-2) +
//     '/' +
//     ('00' + date.getDate()).slice(-2) +
//     '/' +
//     date.getFullYear() +
//     ' ' +
//     ('00' + date.getHours()).slice(-2) +
//     ':' +
//     ('00' + date.getMinutes()).slice(-2) +
//     ':' +
//     ('00' + date.getSeconds()).slice(-2);

//   io.connect().emit('mensajeNuevo', {
//     email: email.value,
//     textoMsj: texto.value,
//     fecha: dateStr,
//   });
//   return false;
// }

// const schemaAuthor = new normalizr.schema.Entity(
//   'author',
//   {},
//   { idAttribute: 'email' }
// );

// //Define esquema de mensaje
// const schemaMensaje = new normalizr.schema.Entity('post', {
//   author: schemaAuthor,
// });

// //Define esquema de mensaje
// const schemaMensajes = new normalizr.schema.Entity('posts', {
//   mensajes: [schemaMensaje],
// });

// io.connect().on('mensajes', ({ normalizedHolding, porcentaje }) => {
//   const denormalizedHolding = normalizr.denormalize(
//     normalizedHolding.result,
//     schemaMensajes,
//     normalizedHolding.entities
//   );

//   const porcentajeMensaje = `Porcentaje Optimizado: ${porcentaje.toFixed(2)} %`;
//   document.getElementById('contenedorMensaje').innerHTML = porcentajeMensaje;

//   let constMensajeHtml = '';

//   denormalizedHolding.mensajes.forEach((msg) => {
//     constMensajeHtml += `
//         <span style="color:blue;">
//         <b>${msg.author.email}</b></span>
//         <span style="color:brown";>${msg.textoMsj}</span>
//         <span style="color:green; font-style:italic";>${msg.fecha}</span>
//         <br>
//        `;
//   });
//   document.getElementById('contenedorMensaje').innerHTML = constMensajeHtml;
// });
