import { pool } from "../database/conexion.js";

export const listar = async (req, res) => {
  try {
    const sql = `SELECT * FROM detalles_pedido`;
    const [result] = await pool.query(sql);
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "No hay detalles para el pedido registrados" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" + error });
  }
};

export const registrar = async (req, res) => {
  const { id_detalle, id_pedido, id_restaurante, id_producto, cantidad, observaciones } = req.body;

  try {
    const sql = `
            INSERT INTO detalles_pedido ( id_detalle, id_pedido, id_restaurante, id_producto, cantidad, observaciones )
            VALUES (?, ?, ?, ?, ?, ?)
        `;
    const [result] = await pool.query(sql, [id_detalle, id_pedido, id_restaurante, id_producto, cantidad, observaciones]);

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
                        id_pedido = ?,
                        id_restaurante = ?,
                        id_producto = ?,
                        cantidad = ?,
                        observaciones = ?
                     WHERE id_detalle = ?`;

    const [rows] = await pool.query(sql, [id_pedido, id_restaurante, id_producto, cantidad, observaciones, id_detalle]);

    if (rows.affectedRows > 0) {
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
    let sql = `SELECT * FROM detalles_pedido WHERE id_detalle =?`;

    const [result] = await pool.query(sql, [id_detalle]);

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        message: "Detalles de Pedido no encontrados",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor" + error,
    });
  }
};

export const eliminar = async (req, res) => {
  try {
    const { id_detalle } = req.params;

    let sql = `DELETE from detalles_pedido WHERE id_detalle = ?`;

    const [rows] = await pool.query(sql, [id_detalle]);

    if (rows.affectedRows > 0) {
      res.status(200).json({
        message: "Detalles de Pedido eliminado con éxito",
      });
    } else {
      res.status(403).json({
        message: "Error al eliminar los Detalles",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor" + error,
    });
  }
};
