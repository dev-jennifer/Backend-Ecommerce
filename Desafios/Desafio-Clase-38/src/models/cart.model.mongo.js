const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const CartSchema = mongoose.Schema(
  {
    buyerID: {
      type: String,
      required: true,
      ref: 'User',
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
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model('cart', CartSchema);

module.exports = CartModel;
