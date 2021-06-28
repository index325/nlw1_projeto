import knex from "knex";

const connection = knex({
  client: "postgres",
  connection: {
    host: "localhost",
    user: "docker",
    database: "ecoleta",
    password: "123456",
  },
  useNullAsDefault: true,
});

export default connection;
