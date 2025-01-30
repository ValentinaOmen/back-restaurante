import { pool } from "../database/conexion.js";

export const listar = async (req, res) => {
  try {
    const sql = `SELECT * FROM facturas`;
    const result = await pool.query(sql);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: "No hay facturas registradas" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const registrar = async (req, res) => {
  const { id_factura, id_pedido, id_restaurante, total, descuento, fecha_factura } = req.body;

  try {
    const sql = `
      INSERT INTO facturas (id_factura, id_pedido, id_restaurante, total, descuento, fecha_factura)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(sql, [id_factura, id_pedido, id_restaurante, total, descuento, fecha_factura]);

    res.status(201).json({ message: "Factura creada exitosamente" });
  } catch (error) {
    console.error("Error al registrar Factura:", error);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const { id_factura } = req.params;
    const { id_pedido, id_restaurante, total, descuento, fecha_factura } = req.body;

    const sql = `
      UPDATE facturas SET
        id_pedido = $1,
        id_restaurante = $2,
        total = $3,
        descuento = $4,
        fecha_factura = $5
      WHERE id_factura = $6
    `;
    const result = await pool.query(sql, [id_pedido, id_restaurante, total, descuento, fecha_factura, id_factura]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: "Factura actualizada correctamente" });
    } else {
      res.status(403).json({ message: "Error al actualizar la Factura" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const buscar = async (req, res) => {
  try {
    const { id_factura } = req.params;
    const sql = `SELECT * FROM facturas WHERE id_factura = $1`;
    const result = await pool.query(sql, [id_factura]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: "Factura no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const eliminar = async (req, res) => {
  try {
    const { id_factura } = req.params;
    const sql = `DELETE FROM facturas WHERE id_factura = $1`;
    const result = await pool.query(sql, [id_factura]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: "Factura eliminada con éxito" });
    } else {
      res.status(403).json({ message: "Error al eliminar la Factura" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};
