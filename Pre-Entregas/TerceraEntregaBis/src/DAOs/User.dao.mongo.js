const ContenedorMongoDB =require("../containers/ContenedorMongoDB");

class UserDao extends ContenedorMongoDB {
	constructor() {
		super('user', {
			email     : {
				type      : String,
				required  : true,
				unique    : true,
				lowercase : true,
			 
			},
			password  : {
				type      : String,
				required  : true,
				minLength : 4
			},
			name    : {
				type     : String,
				required : true,
				trim     : true
			},
			lastName  : { type: String, require: false },
			address : { type: String, require: false },
			age      : { type: Number, require: false },
			phone  : { type: String, require: false },
			avatar    : { type: String, require: false }
		});
	}
}



module.exports= UserDao;

