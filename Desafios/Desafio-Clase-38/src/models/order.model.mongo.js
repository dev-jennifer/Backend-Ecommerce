const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const OrderSchema = mongoose.Schema({
 
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
 
const OrderModel = mongoose.model('orders', OrderSchema);

module.exports = OrderModel;
