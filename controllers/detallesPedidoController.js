const pool = require("../database/db");

// Obtener los detalles de un pedido
const verDetalles = async (req, res) => {
  const { pedido_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM detalles_pedido WHERE pedido_id = $1", [pedido_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

// Crear un detalle de pedido
const crearDetalles = async (req, res) => {
  const { pedido_id, producto_id, cantidad, observaciones, tipo_empaque, precio_total } = req.body;
  try {
    const result = await pool.query("INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, observaciones, tipo_empaque, precio_total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
      pedido_id,
      producto_id,
      cantidad,
      observaciones,
      tipo_empaque,
      precio_total,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

module.exports = {
  verDetalles,
  crearDetalles,
};
