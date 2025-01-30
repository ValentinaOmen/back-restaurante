import { pool } from "../database/conexion.js";

export const listar = async (req, res) => {
  try {
    const sql = `SELECT * FROM restaurantes`;
    const result = await pool.query(sql);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: "No hay restaurantes registrados" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error });
  }
};

export const registrar = async (req, res) => {
  const { id_restaurante, nombre, logo, direccion } = req.body;

  try {
    const sql = `
      INSERT INTO restaurantes (id_restaurante, nombre, logo, direccion)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(sql, [id_restaurante, nombre, logo, direccion]);

    res.status(201).json({
      message: "Restaurante registrado exitosamente",
    });
  } catch (error) {
    console.error("Error al registrar restaurante:", error);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const { id_restaurante } = req.params;
    const { nombre, logo, direccion } = req.body;

    const sql = `
      UPDATE restaurantes SET
        nombre = $1,
        logo = $2,
        direccion = $3
      WHERE id_restaurante = $4
    `;

    const result = await pool.query(sql, [nombre, logo, direccion, id_restaurante]);

    if (result.rowCount > 0) {
      res.status(200).json({
        message: "Restaurante actualizado correctamente",
      });
    } else {
      res.status(403).json({
        message: "Error al actualizar el restaurante",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor: " + error.message,
    });
  }
};

export const buscar = async (req, res) => {
  try {
    const { id_restaurante } = req.params;
    const sql = `SELECT * FROM restaurantes WHERE id_restaurante = $1`;

    const result = await pool.query(sql, [id_restaurante]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({
        message: "Restaurante no encontrado",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor: " + error,
    });
  }
};

export const eliminar = async (req, res) => {
  try {
    const { id_restaurante } = req.params;

    const sql = `DELETE FROM restaurantes WHERE id_restaurante = $1`;

    const result = await pool.query(sql, [id_restaurante]);

    if (result.rowCount > 0) {
      res.status(200).json({
        message: "Restaurante eliminado con éxito",
      });
    } else {
      res.status(403).json({
        message: "Error al eliminar el restaurante",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor: " + error,
    });
  }
};
