class ChatDTO {
  constructor(chat) {
    this.id = chat.id;
    this.email = chat.email;
    this.tipo = chat.tipo;
    this.textoMsj = chat.textoMsj;
    this.fecha = chat.fecha
  }

  getAllSms =  () => {
    return this.id, this.email, this.textoMsj, this.fecha
  };
}
module.exports = ChatDTO;
