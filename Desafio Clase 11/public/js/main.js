const socket = io.connect();
 
function enviarProducto() {
  const nombre = document.querySelector("#nombreProducto");
  const precio = document.querySelector("#precioProducto");
  const foto = document.querySelector("#fotoProducto");
  socket.emit("productoNuevo", {
    nombre: nombre.value,
    precio: precio.value,
    foto: foto.value,
  });
}

function makeHtmlTable(productos) {

  return fetch("./../../views/index.hbs")
    .then((res) => 
    console.log(res))
    // .then((res) => res.text(),
    .then((plantilla) => {
      const template = Handlebars.compile(plantilla);
      const html = template({ productos });
      document.getElementById("app").innerHTML = html;
      return html;
    });
}

/* ---------------------- Chat ----------------------*/
function enviarMensaje() {
  const email = document.querySelector("#email");
  const mensaje = document.querySelector("#mensaje");

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
    email: email.value,
    texto: mensaje.value,
    fecha: dateStr,
  });
  return false;
}

socket.on("mensajes", (mensajes) => {
  console.log(mensajes);
  let constMensajeHtml = "";

  mensajes.forEach((mensaje) => {
    constMensajeHtml += `
        <span style="color:blue;">
          <b>${mensaje.email}</b></span>
        <span style="color:brown";>${mensaje.texto}</span>
        <span style="color:green; font-style:italic";>${mensaje.fecha}</span>
        <br>`;
  });
  // document.getElementById("contenedorMensaje").innerHTML = constMensajeHtml;
});
