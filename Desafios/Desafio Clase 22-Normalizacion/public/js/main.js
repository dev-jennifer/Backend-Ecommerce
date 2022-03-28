const socket = io.connect();

/* ---------------------- Chat ----------------------*/

function enviarMensaje() {
  const id = document.querySelector("#email");
  const nombre = document.querySelector("#nombre");
  const apellido = document.querySelector("#apellido");
  const edad = document.querySelector("#edad");
  const avatar = document.querySelector("#avatar");
  const texto = document.querySelector("#textoMensaje");
  const alias = document.querySelector("#alias");

  const date = new Date();
  const dateStr =
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("00" + date.getDate()).slice(-2) +
    "/" +
    date.getFullYear() +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);

  socket.emit("mensajeNuevo", {
    author: {
      id_email: id.value,
      nombre: nombre.value,
      apellido: apellido.value,
      edad: edad.value,
      alias: alias.value,
      avatar: avatar.value,
    },
    textoMsj: texto.value,
    fecha: dateStr,
  });
  return false;
}
const schemaAuthor = new normalizr.schema.Entity(
  "author",
  {},
  { idAttribute: "id_email" }
);

//Define esquema de mensaje
const schemaMensaje = new normalizr.schema.Entity(
  "post",
  { author: schemaAuthor } 
);

//Define esquema de mensaje
const schemaMensajes = new normalizr.schema.Entity("posts", {
  mensajes: [schemaMensaje],
});

socket.on("mensajes", ({ normalizedHolding, porcentaje }) => {

  const denormalizedHolding = normalizr.denormalize(normalizedHolding.result, schemaMensajes, normalizedHolding.entities)

  const porcentajeMensaje = `Porcentaje Optimizado: ${porcentaje.toFixed(2)} %`;
  document.getElementById("contenedorMensaje").innerHTML = porcentajeMensaje;
 
  let constMensajeHtml = "";
 
  denormalizedHolding.mensajes.forEach((msg) => {

    constMensajeHtml += `
        <span style="color:blue;">
        <b>${msg.author.alias}</b></span>
        <span style="color:brown";>${msg.textoMsj}</span>
        <span style="color:green; font-style:italic";>${msg.fecha}</span>
        <img src="${msg.author.avatar}" style="width:30px";/>
        <br>
       `;
  });
  document.getElementById("contenedorMensaje").innerHTML = constMensajeHtml;
});

