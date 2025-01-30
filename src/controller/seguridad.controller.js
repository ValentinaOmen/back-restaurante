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

// Agregar esta nueva función para registro público
export const registroPublico = async (req, res) => {
  const { id_restaurante, nombre, correo, contrasena, fecha } = req.body;
 
  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ message: "Nombre, correo y contraseña son obligatorios" });
  }

  try {
    const existingUserQuery = "SELECT * FROM usuarios WHERE correo = $1";
    const existingUserResult = await pool.query(existingUserQuery, [correo]);

    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const sql = `
    INSERT INTO usuarios (id_restaurante, nombre, correo, contrasena, rol, fecha)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_usuario`;
    
    // Por defecto, asignar rol de cliente
    const rol = 'Cliente';
    const id_restaurante = 1; // Restaurante por defecto
    
    const result = await pool.query(sql, [
      id_restaurante, 
      nombre, 
      correo, 
      hashedPassword,
      rol,
      fecha || new Date()
    ]);

    res.status(201).json({
      id_usuario: result.rows[0].id_usuario,
      message: "Usuario registrado exitosamente",
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};
