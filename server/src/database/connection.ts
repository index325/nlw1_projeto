import knex from "knex";
import path from "path";

const connection = knex({
  client: "postgres",
  connection: {
    host: "localhost",
    user: "postgres",
    database: "nlw1",
    password: "123456",
  },
  useNullAsDefault: true,
});

export default connection;
