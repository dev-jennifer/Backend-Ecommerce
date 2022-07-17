const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
  silent: process.env.NODE_ENV === 'production',
  // path: path.resolve(process.cwd(), process.env.NODE_ENV + '.env')
});

module.exports = {
  MONGO_DB: {
    MONGO_CONNECT: {
      db: process.env.DB_NAME,
      url: process.env.MONGOURL,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  },
  JWT: { SECRET: process.env.PRIVATE_KEY },

  EMAIL: {
    TEST_EMAIL: process.env.TEST_EMAIL,
    PASS_EMAIL: process.env.PASS_EMAIL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  },
  TWILO: {
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    ACCOUNT_SID: process.env.ACCOUNT_SID,
    TWILO_PHONE: process.env.TWILOPHONE,
    WHATSAPP_ADMIN: process.env.WHATSAPP_ADMIN,
    WHATSAPP_FROM: process.env.WHATSAPP_FROM,
  },

  FILE_DB: {
    PATH: './DB',
  },
  SRV: {
    entorno: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    logger: process.env.LOG || 'DEV',
    persistencia: process.env.PERSISTENCIA || 'mongodb',
  },

  FACEBOOK: {
    FACE_APP_ID: process.env.FACEBOOK_APP_ID,
    FACE_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  },
  GOOGLE: {
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.SECRET_ID,
  },
};
