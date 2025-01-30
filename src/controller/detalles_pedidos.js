import { pool } from "../database/conexion.js";

export const listar = async (req, res) => {
  try {
    const sql = `SELECT * FROM detalles_pedido`;
    const result = await pool.query(sql);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: "No hay detalles para el pedido registrados" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error });
  }
};

export const registrar = async (req, res) => {
  const { id_detalle, id_pedido, id_restaurante, id_producto, cantidad, observaciones } = req.body;

  try {
    const sql = `INSERT INTO detalles_pedido (id_detalle, id_pedido, id_restaurante, id_producto, cantidad, observaciones)
            VALUES ($1, $2, $3, $4, $5, $6)`;
    const result = await pool.query(sql, [id_detalle, id_pedido, id_restaurante, id_producto, cantidad, observaciones]);

    res.status(201).json({
      message: "Detalles registrados exitosamente",
    });
  } catch (error) {
    console.error("Error al registrar Detalles:", error);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const { id_detalle } = req.params;
    const { id_pedido, id_restaurante, id_producto, cantidad, observaciones } = req.body;

    const sql = `UPDATE detalles_pedido SET
                id_pedido = $1,
                id_restaurante = $2,
                id_producto = $3,
                cantidad = $4,
                observaciones = $5
                WHERE id_detalle = $6`;

    const result = await pool.query(sql, [id_pedido, id_restaurante, id_producto, cantidad, observaciones, id_detalle]);

    if (result.rowCount > 0) {
      res.status(200).json({
        message: "Detalles de Pedido actualizados correctamente",
      });
    } else {
      res.status(403).json({
        message: "Error al actualizar los Detalles",
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
    const { id_detalle } = req.params;
    const sql = `SELECT * FROM detalles_pedido WHERE id_detalle = $1`;

    const result = await pool.query(sql, [id_detalle]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({
        message: "Detalles de Pedido no encontrados",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor: " + error.message,
    });
  }
};

export const eliminar = async (req, res) => {
  try {
    const { id_pedido } = req.params;
 
    await pool.query(sqlDetalles, [id_pedido]);
 
    const result = await pool.query(sqlPedido, [id_pedido]);

    if (result.rowCount > 0) {
      res.status(200).json({
        message: "Pedido eliminado exitosamente",
      });
    } else {
      res.status(404).json({
        message: "No se encontró el pedido",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};