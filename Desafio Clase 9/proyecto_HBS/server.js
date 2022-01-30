/* ---------------------- Modulos ----------------------*/
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');

const productos = []
/* ---------------------- Instancia de express ----------------------*/
const app = express();

/* ---------------------- Middlewares ---------------------- */
app.use(express.static('public'));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

/* ---------------------- Conf Motor ----------------------*/
app.set('views', path.join(__dirname, 'views'));


app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: 'hbs'
}));

app.set('view engine', 'hbs');

/* ---------------------- Rutas ----------------------*/

app.get('/', (req, res) => {
    res.render('formulario', {productos});
});

app.get('/resultados', (req, res) => {
    res.render('result', {productos});
});

app.post('/productos', (req, res) => {
    productos.push(req.body)
    res.redirect('/')
});

/* ---------------------- Servidor ----------------------*/
const PORT = 7272;
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto ${PORT}`);
})
server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
});

 