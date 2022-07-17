const ChatDTO = require('../classes/Chat/ChatDTO.class');
const ChatDAOFactory = require('../classes/Chat/ChatDAOFactory.class');
const logger = '../utils/loggers.js';

class ChatController {
  constructor() {
    this.ChatDAO = ChatDAOFactory.get();
  }

  getAllChat =  (req, res) => {
    try {
      //   res.status(200).json({ chat: await this.mostrarTodos() });
      res.render('chat');
    } catch (error) {
      // logger.error('Error al renderizar productos', error);
      res.status(400).send('Status: No se ha renderizar productos');
    }
  };
  getIdChat = async (req, res) => {
    const email = req.params.id;
    try {
      res.status(200).json({ chat: await this.mostrarByEmail(email) });
    } catch (error) {
      logger.error('Error al renderizar producto Id:', error);
      res.status(404).send('Status: Not Found');
    }
  };

  saveChat = (req, res) => {
    const io = req.app.get('socketio');

    io.on('connection', (socket) => {
      socket.emit('hello', { message: 'helloworld' });

      //socket.on('reply', checkHealth.someMethod);
      socket.on('mensajeNuevo', async (msg) => {
        logger.info(`Nuevo cliente conectado ${socket.id}`);
        await this.ChatDAO.guardar(msg);
        const mensajeGuardados = await this.ChatDAO.mostrarTodos();
      });
    });
  };
}
module.exports = ChatController;
