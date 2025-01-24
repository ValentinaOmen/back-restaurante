import { pool } from "../database/conexion.js";

export const listar = async (req, res) => {
  try {
    const sql = `SELECT * FROM productos`;
    const result = await pool.query(sql);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: "No hay productos registrados" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error });
  }
};

export const registrar = async (req, res) => {
  const { id_producto, id_restaurante, nombre, descripcion, precio, imagen, disponibilidad, fecha } = req.body;

  try {
    const sql = `
      INSERT INTO productos (id_producto, id_restaurante, nombre, descripcion, precio, imagen, disponibilidad, fecha)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await pool.query(sql, [id_producto, id_restaurante, nombre, descripcion, precio, imagen, disponibilidad, fecha]);

    res.status(201).json({
      message: "Producto registrado exitosamente",
    });
  } catch (error) {
    console.error("Error al registrar producto:", error);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const { id_restaurante, nombre, descripcion, precio, imagen, disponibilidad, fecha } = req.body;

    const sql = `
      UPDATE productos SET
        nombre = $1,
        descripcion = $2,
        precio = $3,
        imagen = $4,
        disponibilidad = $5,
        fecha = $6
      WHERE id_producto = $7
    `;

    const result = await pool.query(sql, [nombre, descripcion, precio, imagen, disponibilidad, fecha, id_producto]);

    if (result.rowCount > 0) {
      res.status(200).json({
        message: "Producto actualizado correctamente",
      });
    } else {
      res.status(403).json({
        message: "Error al actualizar el Producto",
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
    const { id_producto } = req.params;
    const sql = `SELECT * FROM productos WHERE id_producto = $1`;

    const result = await pool.query(sql, [id_producto]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({
        message: "Producto no encontrado",
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
    const { id_producto } = req.params;

    const sql = `DELETE FROM productos WHERE id_producto = $1`;

    const result = await pool.query(sql, [id_producto]);

    if (result.rowCount > 0) {
      res.status(200).json({
        message: "Producto eliminado con éxito",
      });
    } else {
      res.status(403).json({
        message: "Error al eliminar el producto",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor: " + error,
    });
  }
};
