const express = require('express');

const productos = []

const app = express()

app.use(express.urlencoded({ extended: true }))

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('inicio', { productos });
});

app.get('/resultados', (req, res) => {
    res.render('resultados', { productos });
});

app.post('/productos', (req, res) => {
    productos.push(req.body)
    res.redirect('/')
});

const PORT = 9090
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
