process.on('message', (msg) => {
	const result = getRandom(msg);

	setTimeout(() => {
		process.send(result);
		process.exit;
	}, 5000);
});

function getRandom(cantidad) {
	console.log('cantidad', cantidad);
	let max = 1000;
	let valores = [];
	while (valores.length < cantidad) {
		const value = Math.round(Math.random() * max + 1);
		valores.push(value);
	}
	let repetidos = {};

	valores.forEach(function(numero) {
		repetidos[numero] = (repetidos[numero] || 0) + 1;
	});
  

	return repetidos;
}
