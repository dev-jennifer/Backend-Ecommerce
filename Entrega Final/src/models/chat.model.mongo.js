const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
  usuario: {
      email: { type: String, require: true },
      nombre: { type: String, require: false },
    },
  
  tipo: { type: String, require: true },
  textoMsj: { type: String, require: false },
  fecha: String,
});

const ChatModel = mongoose.model('mensajes', ChatSchema);

module.exports = ChatModel;
