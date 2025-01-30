import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");

// Verificar si el archivo .env existe
console.log("Buscando .env en:", envPath);
dotenv.config({ path: envPath });

const { Pool } = pkg;

// Debug de variables de entorno
console.log("Variables de entorno cargadas:", {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD ? "****" : "no definida",
});

const pool = new Pool({
  user: String(process.env.DB_USER || "postgres"),
  host: String(process.env.DB_HOST || "localhost"),
  database: String(process.env.DB_NAME || "theorder"),
  password: String(process.env.DB_PASSWORD || "7077"),
  port: Number(process.env.DB_PORT || 5432),
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.stack);
    return;
  }
  console.log("Conexión exitosa a la base de datos");
  release();
});

export { pool };
