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