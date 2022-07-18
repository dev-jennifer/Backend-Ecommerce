const dotenv = require('dotenv');
const os = require('os');

dotenv.config({
  silent: process.env.NODE_ENV === 'production',
     
});

module.exports = {
  MONGO_DB: {
    MONGO_CONNECT: {
      // db: process.env.DB_NAME
      url: process.env.MONGOURL,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  },
  JWT: { SECRET: process.env.PRIVATE_KEY_JWT },

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
  SRV: {
    persistencia: 'mongodb',
  },

  FACEBOOK: {
    FACE_APP_ID: process.env.FACEBOOK_APP_ID,
    FACE_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  },

  GOOGLE: {
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.SECRET_ID,
  },
  SERVER: {
    numeroCPUs: process.env.NRO_CPU_MAX || os.cpus().length,
    PORT: parseInt(process.env.PORT) || 8081,
    modoCluster: process.env.MODO_CLUSTER == 'CLUSTER',
    entorno: process.env.NODE_ENV,
    logger: 'DEV'
 
  },
};
