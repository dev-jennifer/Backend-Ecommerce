///PRODUCTOS
async function detail(value) {
  await fetch(`/api/productos/${value}`, { method: "GET" })
    .then(function (response) {
      if (response.ok) {
        console.log("Detalle Producto");
        window.location.href = `/api/productos/${value}`;
      }
      throw new Error("Request failed.");
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function deleting(value) {
  await fetch(`/api/productos/${value}`, {
    method: "DELETE",
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Producto Eliminado");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function edit(value) {
  await fetch(`/api/productos/edit/${value}`, {
    method: "GET",
  })
    .then(function (response) {
      if (response.ok) {
        window.location.href = `/api/productos/edit/${value}`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function actualizar(value) {
  let nombreProducto = document.getElementById("nombreProducto").value;
  let descripcion = document.getElementById("descripcion").value;
  let fotoProducto = document.getElementById("fotoProducto").value;
  let codigo = document.getElementById("codigo").value;
  let precioProducto = document.getElementById("precioProducto").value;
  let stock = document.getElementById("stock").value;

  const data = fetch(`/api/productos/${value}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" }, // tells the server we have json
    body: JSON.stringify({
      nombreProducto,
      descripcion,
      fotoProducto,
      codigo,
      precioProducto,
      stock,
    }),
  })
    .then((res) =>  window.location.href = `/api/productos/`)
    .catch((error) => {
      console.log(error);
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
})

///CARRITO

async function agregar(idProducto) {
  if (!localStorage.getItem("my_token")) {
    await fetch(`/api/carrito/`, { method: "POST" })
      .then((response) => {
        return response.json();
      })

      .then(async (data) => {
        if (data.estado == true) {
          window.localStorage.setItem("my_token", data.id);
          await fetch(`/api/carrito/${data.id}/productos/${idProducto}`, {
            method: "POST",
          });
        }
        console.log("error");
      });
  } else {
    const idCart = window.localStorage.getItem("my_token");
    await fetch(`/api/carrito/${idCart}/productos/${idProducto}`, {
      method: "POST",
    });
    console.log("carrito existente");
  }
}

function cart() {
  let idCart = 0;
  localStorage.getItem("my_token")
    ? (idCart = window.localStorage.getItem("my_token"))
    : (idCart = 0);
  console.log(idCart);
  window.location.href = `/api/carrito/${idCart}/productos`;
}

async function deleteItemCart(idProducto, idCarrito) {
  await fetch(`/api/carrito/${idCarrito}/productos/${idProducto}`, {
    method: "DELETE",
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Producto Eliminado");
        window.location.href = `/api/carrito/${idCarrito}/productos`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function borrarCarrito(idCarrito) {
  await fetch(`/api/carrito/${idCarrito}`, {
    method: "DELETE",
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Carrito Eliminado");
        window.location.href = `/api/carrito/${idCarrito}/productos`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
