// const socket = io.connect()

///PRODUCTOS
async function detail(value) {
	await fetch(`/api/productos/${value}`, { method: 'GET' })
		.then(function(response) {
			if (response.ok) {
				window.location.href = `/api/productos/${value}`;
			}
			throw new Error('Request failed.');
		})
		.catch(function(error) {
			console.log(error);
		});
}

async function deleting(value) {
	await fetch(`/api/productos/${value}`, {
		method : 'DELETE'
	})
		.then(function(response) {
			if (response.ok) {
				console.log('Producto Eliminado');
			}
		})
		.catch(function(error) {
			console.log(error);
		});
}

async function edit(value) {
	await fetch(`/api/productos/edit/${value}`, {
		method : 'GET'
	})
		.then(function(response) {
			if (response.ok) {
				window.location.href = `/api/productos/edit/${value}`;
			}
		})
		.catch(function(error) {
			console.log(error);
		});
}

async function actualizar(value) {
	let nombreProducto = document.getElementById('nombreProducto').value;
	let descripcion = document.getElementById('descripcion').value;
	let fotoProducto = document.getElementById('fotoProducto').value;
	let codigo = document.getElementById('codigo').value;
	let precioProducto = document.getElementById('precioProducto').value;
	let stock = document.getElementById('stock').value;

	const data = fetch(`/api/productos/${value}`, {
		method  : 'PUT',
		headers : { 'Content-Type': 'application/json' }, // tells the server we have json
		body    : JSON.stringify({
			nombreProducto,
			descripcion,
			fotoProducto,
			codigo,
			precioProducto,
			stock
		})
	})
		.then((res) => (window.location.href = `/api/productos/`))
		.catch((error) => {
			console.log(error);
		});
}

/* ---------------------- Cart ----------------------*/

async function agregar(idProducto) {
	if (!localStorage.getItem('my_token')) {
		const response = await fetch(`/api/carrito/`, { method: 'POST' });
		const json = await response.json();

		console.log('response', `/api/carrito/${json.data.buyerID}/productos/${idProducto}`);
		
		await fetch(`/api/carrito/${json.data.buyerID}/productos/${idProducto}`, {
			method : 'POST'
		});
		localStorage.setItem('my_token', json.data.buyerID);
	}

	const idCart = window.localStorage.getItem('my_token');
	await fetch(`/api/carrito/${idCart}/productos/${idProducto}`, {
		method : 'POST'
	});
}


function cart() {
	let idCart = 0;
	localStorage.getItem('my_token') ? (idCart = window.localStorage.getItem('my_token')) : (idCart = 0);
	window.location.href = `/api/carrito/${idCart}/productos`;
}

async function deleteItemCart(idProducto) {
	const idCart = window.localStorage.getItem('my_token');
	await fetch(`/api/carrito/${idCart}/productos/${idProducto}`, {
		method : 'DELETE'
	})
		.then(function(response) {
			if (response.ok) {
				window.location.href = `/api/carrito/${idCart}/productos`;
			}
		})
		.catch(function(error) {
			console.log(error);
		});
}


async function borrarCarrito() {

	const idCart = window.localStorage.getItem('my_token');
	await fetch(`/api/carrito/${idCart}`, {
		method : 'DELETE'
	})
		.then(function(response) {
			if (response.ok) {
				console.log('Carrito Eliminado');
				window.location.href = `/api/carrito/${idCart}/productos`;
			}
		})
		.catch(function(error) {
			console.log(error);
		});
}


var fileTag = document.getElementById('avatar'),
	preview = document.getElementById('preview');
fileTag
	? fileTag.addEventListener('change', function() {
			changeImage(this);
		})
	: '';

function changeImage(input) {
	var reader;

	if (input.files && input.files[0]) {
		reader = new FileReader();

		reader.onload = function(e) {
			preview.setAttribute('src', e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
	}
}
