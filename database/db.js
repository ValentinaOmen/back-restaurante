const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "restaurante",
  password: "1065",
  port: 5432,
});

module.exports = pool;

console.log("Conectado a la base de datos");