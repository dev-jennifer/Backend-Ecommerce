const dotenv = require('dotenv');
const path=require("path")
dotenv.config({
   silent: process.env.NODE_ENV === 'production' ,
  // path: path.resolve(process.cwd(), process.env.NODE_ENV + '.env')
});

module.exports = {
  MONGO_DB: {
    MONGO_CONNECT: {
      connection_string: process.env.MONGOURL,
      host: process.env.MONGO_HOST || 'localhost',
      port: process.env.MONGO_PORT || 27017,
      database: process.env.DB_NAME_P,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      },
    },
    // MONGO_URI: `mongodb://${process.env.DB_USER || 'localhost'}:${
    //   process.env.PORTDB || 27017 } /${process.env.DB_NAME_P}`,
    OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    },
  },

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
};

