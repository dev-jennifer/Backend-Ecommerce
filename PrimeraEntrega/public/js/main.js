// const buttonProductos = document.getElementById("homeButton");
// buttonProductos.addEventListener("click", productosGet);

// function productosGet() {
//   fetch('/productos', { method: "GET"})

//   .then(function (response) {
//     if (response.ok) {
//       console.log("hola");
//     }
//     throw new Error("Request failed.");
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// }

async function detail(value) {
  await fetch(`/productos/${value}`, { method: "GET" })
    .then(function (response) {
      if (response.ok) {
        console.log("Detalle Producto");
        window.location.href = `/productos/${value}`;
      }
      throw new Error("Request failed.");
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function deleting(value) {
  await fetch(`/productos/${value}`, {
    method: "DELETE",
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Producto Eliminado");
        window.location.href = "/productos";
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
async function edit(value) {
  await fetch(`/productos/edit/${value}`, {
    method: "GET",
  })
    .then(function (response) {
      if (response.ok) {
        window.location.href = `/productos/edit/${value}`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function actualizar(value) {
 console.log("Paso 1")

  let nombreProducto = document.getElementById("nombreProducto").value;
  let descripcion = document.getElementById("descripcion").value;
  let fotoProducto = document.getElementById("fotoProducto").value;
  let codigo = document.getElementById("codigo").value;
  let precioProducto = document.getElementById("precioProducto").value;
  let stock = document.getElementById("stock").value;


  const data = await fetch(`/productos/${value}`, {
    method: 'PUT',
    headers: {
    // 'Content-Type': 'application/json'
    'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({nombreProducto,
      descripcion,
      fotoProducto,
      codigo,
      precioProducto,
      stock})
  })

  const res = await data.json();

  // if (res.estado) {
  //   console.log("perfecto");
  //   // window.location.href = "/productos";
  // } else {
  //   console.log(res);
  // }
}
