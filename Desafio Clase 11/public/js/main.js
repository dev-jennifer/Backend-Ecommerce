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

socket.on("productos", productos => {
  let html = "";
  if (productos.length) {
    html += "<table class='table table-dark'><tr><th>Nombre</th><th>Precio</th><th>Foto URL</th></tr>";
    productos.forEach(productoIndiv => {
     
        html += `<tr>
        <td>${productoIndiv.nombre}</td>
        <td>${productoIndiv.precio}</td>
        <td> <img
          style="display: inline-flex; width: 40px; height: 40px"
          src=" ${productoIndiv.foto}"/>
       </td></tr>`;

    });
    html += "</table>";
     console.log(html)
    document.getElementById("contenedor").innerHTML = html;
  }
});
