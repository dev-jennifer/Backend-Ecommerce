const express = require('express');
const config = require('./config.js');
const app = express()
const routerProductos = require('./rutas/productosRutas');//Segmento de rutas 1
const bodyParser = require('body-parser');

/* ---------------------- Middlewares ---------------------- */

app.use(express.static('public'));
// app.use(morgan('tiny'));
routerProductos.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ---------------------- Rutas ----------------------*/
/*Agregamos routers a la app*/
app.use('/api/productos', routerProductos);

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html')
})

/* ---------------------- Servidor ----------------------*/

console.log(`NODE_ENV=${config.NODE_ENV}`);

const server = app.listen(config.PORT, config.HOST, ()=>{
    console.log(`Servidor escuchando http://${config.HOST}:${config.PORT}`);
})
server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
})