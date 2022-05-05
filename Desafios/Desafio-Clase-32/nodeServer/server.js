import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import compression from 'compression';
import  logger   from './logger.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { normalizedHolding } from './src/utils/normalizr.js';
import productosTestRuta from './rutas/productosTestRuta.js';
import autentificacionRuta from './rutas/autentificacionRuta.js';
import infoRuta from './rutas/infoRuta.js';

import hbs from 'hbs';
import bodyParser from 'body-parser';
import apiRandomRuta from './rutas/apiRandomRuta.js';

import cluster from 'cluster';
import os from 'os';
import path from 'path';

import MensajesDAO from './src/DAO/firebase.dao.js';
const mensajeClass = new MensajesDAO();

const app = express();
// Comprimir todas las respuestas HTTP
const httpServer = new createServer(app);
const io = new Server(httpServer);

app.use(compression());

/*----------------------------- Session ------------------------------*/
app.use(cookieParser());
app.use(
	session({
		secret            : '1234567890!@#$%^&*()',
		resave            : false,
		saveUninitialized : false,
		cookie            : {
			secure : 'auto',
			maxAge : 60000
		}
	})
);
app.use(function(req, res, next) {
	res.locals.session = req.session;
	next();
});

const __dirname = path.resolve();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/public/views');
hbs.registerPartials(__dirname + '/public/views/partials', function(err) {});

/*============================[Mensaje Socket]============================*/
io.on("connection", async (socket) => {
  logger.info(`Nuevo cliente conectado ${socket.id}`);
	socket.on('mensajeNuevo', async (msg) => {
		await mensajeClass.guardar(msg);
		const mensajeGuardados = await mensajeClass.mostrarTodos();

		const normalizar = normalizedHolding(mensajeGuardados);
		const longO = JSON.stringify(mensajeGuardados).length;
		const longN = JSON.stringify(normalizar).length;
		const porcentaje = longN * 100 / longO;

		socket.emit('mensajes', {
			normalizedHolding : normalizar,
			porcentaje        : porcentaje
		});
	});
});

/*-------------------------- Passport ------------------------------*/
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
/*---------------------------- Rutas --------------------------------*/
app.use('/', autentificacionRuta);
app.use('/', productosTestRuta);
app.use('/info', infoRuta);
app.use('/api/random', apiRandomRuta);

app.get('/chat', (req, res) => {
	res.render('chat');
});

 

app.get('*', (req, res) => {
	const { url, method } = req;
	logger.warn(`Ruta ${method} ${url} no implementada`);
	res.send(`Ruta ${method} ${url} no está implementada`);
});


const numeroCPUs = os.cpus().length;
const PORT = parseInt(process.argv[2]) || 8080
const modoCluster = process.argv[3] == 'CLUSTER'

		// For Master process
		if (modoCluster && cluster.isPrimary) {
			logger.info('CPUs:', numeroCPUs);
			logger.info(`Master ${process.pid} is running`);
			// Fork workers.
			for (let i = 0; i < numeroCPUs; i++) {
				cluster.fork();
			}

			// This event is firs when worker died
			cluster.on('exit', (worker) => {
				logger.info(`worker ${worker.process.pid} died`);
			});
		} else {
			// For Worker
			const server = httpServer.listen(PORT, () => {
				logger.info(
					`Servidor HTTP escuchado en puerto ${server.address()
						.port} - PID ${process.pid} - ${new Date().toLocaleString()}`
				);
			});
		     	server.on('error', (error) => logger.error(`Error en servidor ${error}`));
		}



//node -prof server.js 8080 FORK
//$ curl -X GET "http://localhost:8080/info"

//node --prof-process ArtilleryResult_ConsoleActivate-v8.log > ProfResultConsole.txt
//node --prof-process ArtilleryResult_ConsoleNOActivate-v8.log > ProfResultNOConsole.txt

//node -prof server.js 8080 FORK
//autocannon -c 100 -d 20 -p 1 http://localhost:8080/info
//node --prof-process isolate-000002AEEBA74ED0-13428-v8.log > AutocanonResultConsole.txt