const ContenedorMongoDB = require('../containers/ContenedorMongoDb.js');
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

class PedidoDAO extends ContenedorMongoDB {
  constructor() {
    super('pedido', {
      buyerID: {
        type: String,
        required: true,
        ref: 'User',
      },
      name: {
        type: String,
 
      },
      items: [
        {
          itemId: {
            type: ObjectID,
            ref: 'Item',
          },
          foto: String,
          nombre: String,
          cantidad: {
            type: Number,
            min: 1,
            default: 1,
          },
          precio: Number,
        },
      ],
      total: {
        type: Number,
        required: true,
        default: 0,
      },

      timestamps: String,
    });
  }
}
module.exports = PedidoDAO;
