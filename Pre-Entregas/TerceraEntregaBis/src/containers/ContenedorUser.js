import mongoose from "mongoose";
import { MongoClient } from 'mongodb';

// config.js
import dotenv from 'dotenv';
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env
	.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

class ContenedorUser {
	constructor() {
		this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.client.connect((error) => {
				if (error) {
					reject(error);
				}
				console.log('Connected succesfully to mongo');
				resolve(this.client.db(this.dbName).collection('users'));
			});
		});
	}

	save = async (body) => {
		try {
			this.connect().then((db) => {
				db.insertOne(body);
			});
		} catch (error) {
			console.log(error);
			res.status(400).send(error);
		}
	};

findById = async (id) => {
    try {
		this.connect().then((db) => {
      db.findOne({ _id: id });

    })} catch (error) {
      console.log(error);

      return {
        code: "003",
        msg: "Error al mostrar",
      };
    }
  }
}
//   try {
//     let doc = this.coleccion.doc();
//     const user = new User(req.body)
//     await doc.create(body);
//     const token = await user.generateAuthToken()
//     res.status(201).send({ user, token })
//     return {
//       msg: "Elemento guardado!",
//     };
//   } catch (error) {
//     console.log(error);
//       res.status(400).send(error)
//     };
//   }
// };

export default ContenedorUser;
