import { pool } from "../database/conexion.js";

export const listar = async (req, res) => {
  try {
    const sql = `SELECT * FROM pedidos`;
    const result = await pool.query(sql);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: "No hay pedidos registrados" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const registrar = async (req, res) => {
  const { id_pedido, id_usuario, id_restaurante, estado, tipo_consumo, direccion, fecha } = req.body;

  try { 
    const usuarioResult = await pool.query("SELECT nombre FROM usuarios WHERE id_usuario = $1", [id_usuario]);

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const nombre_cliente = usuarioResult.rows[0].nombre;  
 
    const sql = `
      INSERT INTO pedidos (id_pedido, id_usuario, id_restaurante, nombre_cliente, estado, tipo_consumo, direccion, fecha)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await pool.query(sql, [id_pedido, id_usuario, id_restaurante, nombre_cliente, estado, tipo_consumo, direccion, fecha]);

    res.status(201).json({ message: "Pedido registrado exitosamente" });
  } catch (error) {
    console.error("Error al registrar pedido:", error);
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const actualizar = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const { id_usuario, id_restaurante, estado, tipo_consumo, direccion, fecha } = req.body;

    // Obtener el nombre del cliente
    const usuarioResult = await pool.query("SELECT nombre FROM usuarios WHERE id_usuario = $1", [id_usuario]);

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const nombre_cliente = usuarioResult.rows[0].nombre;

    // Actualizar el pedido
    const sql = `
      UPDATE pedidos SET
        id_usuario = $1,
        id_restaurante = $2,
        nombre_cliente = $3,
        estado = $4,
        tipo_consumo = $5,
        direccion = $6,
        fecha = $7
      WHERE id_pedido = $8
    `;
    const result = await pool.query(sql, [id_usuario, id_restaurante, nombre_cliente, estado, tipo_consumo, direccion, fecha, id_pedido]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: "Pedido actualizado correctamente" });
    } else {
      res.status(403).json({ message: "Error al actualizar el Pedido" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const buscar = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const sql = `SELECT * FROM pedidos WHERE id_pedido = $1`;
    const result = await pool.query(sql, [id_pedido]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};

export const eliminar = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const sql = `DELETE FROM pedidos WHERE id_pedido = $1`;
    const result = await pool.query(sql, [id_pedido]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: "Pedido eliminado con éxito" });
    } else {
      res.status(403).json({ message: "Error al eliminar el pedido" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor: " + error.message });
  }
};
