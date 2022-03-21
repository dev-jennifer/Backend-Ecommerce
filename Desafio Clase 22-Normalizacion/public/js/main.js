const socket = io.connect()


/* ---------------------- Chat ----------------------*/

function enviarMensaje() {
  const id = document.querySelector("#id");
  const nombre = document.querySelector("#nombre");
  const apellido = document.querySelector("#apellido");
  const edad = document.querySelector("#edad");
  const avatar = document.querySelector("#avatar");
  const mensaje = document.querySelector("#mensaje");
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
    id: id.value,
    nombre: nombre.value,
    apellido: apellido.value,
    edad: edad.value,
    alias: alias.value,
    avatar: avatar.value,
    mensaje: mensaje.value,
    fechaHora: dateStr,
  });
  return false;
}

socket.on("mensajes", (mensajes) => {
 
  let constMensajeHtml = "";

  mensajes.forEach((msg) => {
    console.log(msg)
    constMensajeHtml += `
        <span style="color:blue;">
          <b>${msg.author.alias}</b></span>
        <span style="color:brown";>${msg.mensaje}</span>
        <span style="color:green; font-style:italic";>${msg.author.fechaHora}</span>
        <br>
        <img src="${msg.author.avatar}" style="width:30px";/>`;
  })


  document.getElementById("contenedorMensaje").innerHTML = constMensajeHtml;
})


 


