const dotenv = require( 'dotenv');
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

  const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME_P}?retryWrites=true&w=majority`;
 
 
    
TEST_EMAIL=process.env.TEST_EMAIL,
PASS_EMAIL=process.env.PASS_EMAIL
 
    
 module.exports={MONGO_URI,TEST_EMAIL,PASS_EMAIL }