import bcrypt from "bcrypt";
import { pool } from "../database/conexion.js";

export const listar = async (req, res) => {
  try {
    const sql = `SELECT * FROM usuarios`;
    const { rows } = await pool.query(sql);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ error: "No hay usuarios registrados" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error });
  }
};

export const registrarUsuario = async (req, res) => {
  const { id_restaurante, nombre, correo, contrasena, rol, fecha } = req.body;

  // Validar campos
  if (!id_restaurante || !nombre || !correo || !contrasena || !rol || !fecha) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
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
    const result = await pool.query(sql, [id_restaurante, nombre, correo, hashedPassword, rol, fecha]);

    res.status(201).json({
      id_usuario: result.rows[0].id_usuario,
      message: "Usuario registrado exitosamente",
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const actualizar = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { id_restaurante, nombre, correo, contrasena, rol, fecha } = req.body;

    // Encriptar la contraseña si se proporciona
    let hashedPassword = contrasena;
    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(contrasena, salt);
    }

    const sql = `
      UPDATE usuarios SET
        id_restaurante = $1,
        nombre = $2,
        correo = $3,
        contrasena = $4,
        rol = $5,
        fecha = $6
      WHERE id_usuario = $7`;

    const result = await pool.query(sql, [id_restaurante, nombre, correo, hashedPassword, rol, fecha, id_usuario]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: "Usuario actualizado correctamente" });
    } else {
      res.status(403).json({ message: "Error al actualizar el Usuario" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const buscar = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const sql = `SELECT * FROM usuarios WHERE id_usuario = $1`;
    const { rows } = await pool.query(sql, [id_usuario]);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error });
  }
};

export const eliminar = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const sql = `DELETE FROM usuarios WHERE id_usuario = $1`;
    const result = await pool.query(sql, [id_usuario]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: "Usuario eliminado con éxito" });
    } else {
      res.status(403).json({ message: "Error al eliminar el usuario" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error });
  }
};
