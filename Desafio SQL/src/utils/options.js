const options = {
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
module.exports = { options };
