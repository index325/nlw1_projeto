import path from "path";

module.exports = {
  client: "postgres",
  connection: {
    host: "localhost",
    user: "docker",
    database: "ecoleta",
    password: "123456",
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "src", "database", "seeds"),
  },
  useNullAsDefault: true,
};
