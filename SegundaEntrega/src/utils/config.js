const config = {
  mongodb: {
    url: "mongodb://localhost:27017/ecommerce",
  },
  firebase: {
    rutaCert: "../DB/.....",
  },

  mariaDB: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "usershop",
      password: "some_pass",
      database: "productos",
    },
  },
  sqlite2: {
    client: "better-sqlite3",
    connection: {
      filename: "./DB/ecommerce.sqlite",
    },
    useNullAsDefault: true,
  },
};

export default config