const ContenedorMongoDB=require("../containers/ContenedorMongoDb.js");
const  mongoose= require( 'mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

class CarritoDAO extends ContenedorMongoDB {
  constructor() {
    
    super(
      "carrito",
      {
        buyerID: {
          type: String,
          required: true,
          ref: "User",
        },
        items: [
          {
            itemId: {
              type: ObjectID,
              ref: "Item"
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
           default: 0
          }
        }, {
        timestamps: true,
      }
    );
  }
}
module.exports=CarritoDAO;
