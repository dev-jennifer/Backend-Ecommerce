const express = require('express');
const ChatDAOFactory = require('../classes/Chat/ChatDAOFactory.class');
const ChatController = require('../controllers/chat.controller');
const router = express.Router();
const logger = require('../utils/loggers.js');

module.exports = (io) => {
  io.on('connection', async function (socket) {
    logger.info(`Nuevo cliente conectado ${socket.id}`);

    const mensajeGuardados = await ChatDAOFactory.get().mostrarTodos();

    socket.emit('mensajes', {
      mensajes: mensajeGuardados,
    });

    socket.on('mensajeNuevo', async (msg) => {
 
      await ChatDAOFactory.get()
        .guardar(msg)

        .then(async () =>
          socket.emit('mensajes', await ChatDAOFactory.get().mostrarTodos())
        )
        .catch((err) => {
          logger.error(`Error: ${err} al agregar mensaje`);
        });


    });
  });

  router.get('/',  new ChatController().getAllChat );
  router.get('/:id', new ChatController().getIdChat);
  return router;
};
