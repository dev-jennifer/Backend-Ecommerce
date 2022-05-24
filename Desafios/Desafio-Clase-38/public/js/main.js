// const socket = io.connect()

///PRODUCTOS
async function detail(value) {
  await fetch(`/api/productos/${value}`, { method: 'GET' })
    .then(function (response) {
      if (response.ok) {
        window.location.href = `/api/productos/${value}`;
      }
      throw new Error('Request failed.');
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function deleting(value) {
  await fetch(`/api/productos/${value}`, {
    method: 'DELETE',
  })
    .then(function (response) {
      if (response.ok) {
        console.log('Producto Eliminado');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function edit(value) {
  await fetch(`/api/productos/edit/${value}`, {
    method: 'GET',
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
  let nombre = document.getElementById('nombre').value;
  let descripcion = document.getElementById('descripcion').value;
  let foto = document.getElementById('foto').value;
  let codigo = document.getElementById('codigo').value;
  let precio = document.getElementById('precio').value;
  let stock = document.getElementById('stock').value;

  const data = fetch(`/api/productos/${value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({
      nombre,
      descripcion,
      foto,
      codigo,
      precio,
      stock,
    }),
  })
    .then((res) => (window.location.href = `/api/productos/`))
    .catch((error) => {
      console.log(error);
    });
}

/* ---------------------- Cart ----------------------*/
async function agregar(idProducto) {
  if (!localStorage.getItem('my_token')) {
    const result = fetch(`/api/carrito/`, { method: 'POST' })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        const id = data.data.buyerID;
        localStorage.setItem('my_token', id);
        console.log('ID', id);
        return fetch(`/api/carrito/${id}/productos/${idProducto}`, {
          method: 'POST',
        });
      })
      .catch((err) => {
        console.error('Request failed', err);
      });
  }

  const idCart = window.localStorage.getItem('my_token');
  await fetch(`/api/carrito/${idCart}/productos/${idProducto}`, {
    method: 'POST',
  });
}

function cart() {
  let idCart = 0;
  localStorage.getItem('my_token')
    ? (idCart = window.localStorage.getItem('my_token'))
    : (idCart = 0);
  window.location.href = `/api/carrito/${idCart}/productos`;
}

async function deleteItemCart(idProducto) {
  const idCart = window.localStorage.getItem('my_token');
  await fetch(`/api/carrito/${idCart}/productos/${idProducto}`, {
    method: 'DELETE',
  })
    .then(function (response) {
      if (response.ok) {
        window.location.href = `/api/carrito/${idCart}/productos`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function borrarCarrito() {
  const idCart = window.localStorage.getItem('my_token');
  await fetch(`/api/carrito/${idCart}`, {
    method: 'DELETE',
  })
    .then(function (response) {
      if (response.ok) {
        console.log('Carrito Eliminado');
        window.location.href = `/api/carrito/${idCart}/productos`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function comprar() {
  const idCart = window.localStorage.getItem('my_token');

  window.location.href = `/api/pedido/${idCart}`;
}

/* ---------------------- Profile ----------------------*/
var fileTag = document.getElementById('avatar'),
  preview = document.getElementById('preview');
fileTag
  ? fileTag.addEventListener('change', function () {
      changeImage(this);
    })
  : '';

function changeImage(input) {
  var reader;

  if (input.files && input.files[0]) {
    reader = new FileReader();

    reader.onload = function (e) {
      preview.setAttribute('src', e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

/* ---------------------- Order ----------------------*/
async function actualizarOrder() {
  let email = document.getElementById('email').value;
  let name = document.getElementById('name').value;
  let lastName = document.getElementById('lastName').value;
  let address = document.getElementById('address').value;
  let phone = document.getElementById('phone').value;


const idCart = window.localStorage.getItem('my_token');
  const data = fetch(`/api/pedido/${idCart}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      name,
      lastName,
      address,
      phone,
    }),
  })
   
  await fetch(`/api/carrito/${idCart}`, {
    method: 'DELETE',
  })
    .then(() => localStorage.removeItem('my_token'))
    .finally(() => (window.location.href = `/api/pedido/gracias`))
    .catch((error) => {
      console.log(error);
    });
}


/* ---------------------- Register ----------------------*/

 

   
 
// document.getElementById('btnSubmit').addEventListener('click', function (e) {
//   e.preventDefault();
//   const phoneNumber = iti.getNumber();
//   const activeItem = iti.activeItem.dataset;
//  const ibxCode = activeItem.dialCode;

  /*
    Si es para mandarlo por Ajax o Fetch
    construyes un objeto como este
    y lo mandas. Y en el servidor los recuperas
    usando las claves de la izquierda:
    ibxCode y phone
  */

 
// });