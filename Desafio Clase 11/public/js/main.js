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

socket.on("productos", (productos) => {
  let html = "";
  if (productos.length) {
    html +=
      "<table class='table table-dark'><tr><th>Nombre</th><th>Precio</th><th>Foto URL</th></tr>";
    productos.forEach((productoIndiv) => {
      html += `<tr>
        <td>${productoIndiv.nombre}</td>
        <td>${productoIndiv.precio}</td>
        <td> <img
          style="display: inline-flex; width: 40px; height: 40px"
          src=" ${productoIndiv.foto}"/>
       </td></tr>`;
    });
    html += "</table>";
    console.log(html);
    document.getElementById("contenedor").innerHTML = html;
  }
});

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
    fecha: dateStr
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
  document.getElementById("contenedorMensaje").innerHTML = constMensajeHtml;
});
