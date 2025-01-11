const express = require("express");
// Importar controladores
const { verDetalles, crearDetalles } = require("../controllers/detallesPedidoController");

const router = express.Router();

// Rutas de detalles de pedido
router.get("/:pedido_id", verDetalles);
router.post("/", crearDetalles);

module.exports = router;
