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

// function detail(value) {
//   fetch(`/productos/${value}`, { method: "GET" })
//   .then(function (response) {
//     if (response.ok) {
//       console.log("Detalle Producto");
//     }
//     throw new Error("Request failed.");
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// }

async function deleting(value) {

    const data = await fetch(`/productos/${value}`, {
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
  // const nombreProducto = document.querySelector('#nombreProducto').value
  // const descripcion = document.querySelector('#descripcion').value
  // const fotoProducto = document.querySelector('#fotoProducto').value
  // const codigo = document.querySelector('#codigo').value
  // const precioProducto = document.querySelector('#precioProducto').value
  // const stock = document.querySelector('#stock').value

  const data = await fetch(`/productos/${value}`, {
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // body: JSON.stringify({nombreProducto, descripcion})
})

const res = await data.json()

if(res.estado){
    window.location.href = '/productos'
}else{
    console.log(res)
}
}
  

