const dotenv = require('dotenv');
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME_P}?retryWrites=true&w=majority`;

//email
 const TEST_EMAIL = process.env.TEST_EMAIL,
PASS_EMAIL = process.env.PASS_EMAIL;

//TWILO

const AUTH_TOKEN = process.env.AUTH_TOKEN,
  ACCOUNT_SID = process.env.ACCOUNT_SID,
  TWILO_PHONE = process.env.TWILOPHONE; 

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const WHATSAPP_ADMIN = process.env.WHATSAPP_ADMIN;
const WHATSAPP_FROM = process.env.WHATSAPP_FROM;
module.exports = {
  MONGO_URI,
  TEST_EMAIL,
  PASS_EMAIL,
  AUTH_TOKEN,
  ACCOUNT_SID,
  TWILO_PHONE,
  ADMIN_EMAIL,
  WHATSAPP_ADMIN,
  WHATSAPP_FROM,
};
