import { pool } from "../database/conexion.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// Verificar variables de entorno requeridas
const checkEnvVariables = () => {
  if (!process.env.AUT_SECRET) throw new Error("AUT_SECRET no está configurada");
  if (!process.env.AUT_EXPIRE) throw new Error("AUT_EXPIRE no está configurada");
};

export const validar = async (req, res) => {
  try {
    checkEnvVariables();
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ message: "Correo y contraseña son requeridos" });
    }

    const result = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const validContrasena = await bcrypt.compare(contrasena, user.contrasena);

    if (!validContrasena) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = Jwt.sign(
      {
        userId: user.id_usuario,
        nombre: user.nombre,
        rol: user.rol,
      },
      process.env.AUT_SECRET,
      { expiresIn: process.env.AUT_EXPIRE }
    );

    return res.status(200).json({
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
      token,
      message: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error("Error en validar:", error);
    res.status(500).json({
      status: 500,
      message: `Error del servidor: ${error.message}`,
    });
  }
};

export const validarToken = async (req, res, next) => {
  try {
    checkEnvVariables();
    const tokenClient = req.headers["token"];

    if (!tokenClient) {
      return res.status(403).json({ message: "Token es requerido" });
    }

    Jwt.verify(tokenClient, process.env.AUT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(403).json({
          message: error.name === "TokenExpiredError" ? "Token ha expirado" : "Token es inválido",
        });
      }

      req.user = {
        userId: decoded.userId,
        nombre: decoded.nombre,
        rol: decoded.rol,
      };
      next();
    });
  } catch (error) {
    console.error("Error en validarToken:", error);
    return res.status(500).json({
      status: 500,
      message: `Error del servidor: ${error.message}`,
    });
  }
};
