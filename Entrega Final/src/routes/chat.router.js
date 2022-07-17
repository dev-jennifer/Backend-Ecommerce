const express = require('express');
const ChatDAOFactory = require('../classes/Chat/ChatDAOFactory.class');
const ChatController = require('../controllers/chat.controller');
const router = express.Router();
const { normalizedHolding } = require('../utils/normalizr');
const logger = require('../utils/loggers.js');

module.exports = (io) => {
  io.on('connection', async function (socket) {
    logger.info(`Nuevo cliente conectado ${socket.id}`);

    const mensajeGuardados = await ChatDAOFactory.get().mostrarTodos();
    const normalizar = normalizedHolding(mensajeGuardados);

    socket.emit('mensajes', {
      mensajes: mensajeGuardados,
    });

    socket.on('mensajeNuevo', async (msg) => {
      console.log('nuevo', msg);
      await ChatDAOFactory.get()
        .guardar(msg)

        .then(async () =>
          socket.emit('mensajes', await ChatDAOFactory.get().mostrarTodos())
        )
        .catch((err) => {
          logger.error(`Error: ${err} al agregar mensaje`);
        });

      // console.log('normalizar', normalizar);
    });
  });

  //router.post('/', ChatController);
  router.get('/',  new ChatController().getAllChat );
  router.get('/:id', new ChatController().getIdChat);
  return router;
};
