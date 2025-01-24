const pool = require("../database/db");

// Obtener todos los pedidos
const verPedidos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pedidos");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

// Crear un nuevo pedido
const crearPedido = async (req, res) => {
  const { cliente_id, restaurante_id, nombre_cliente, direccion, tipo } = req.body;
  try {
    const result = await pool.query("INSERT INTO pedidos (cliente_id, restaurante_id, nombre_cliente, direccion, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING *", [
      cliente_id,
      restaurante_id,
      nombre_cliente,
      direccion,
      tipo,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

// Actualizar el estado de un pedido
const actualizarPedido = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    const result = await pool.query("UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *", [estado, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

module.exports = {
  verPedidos,
  crearPedido,
  actualizarPedido,
};
