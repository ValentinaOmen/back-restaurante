const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "restaurantes",
  password: "7077",
  port: 5432,
});

module.exports = pool;

console.log("Conectado a la base de datos");