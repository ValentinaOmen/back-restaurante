const express = require("express");

const { verDetalles, crearDetalles } = require("../controllers/detallesPedidoController");

const router = express.Router();

router.get("/:pedido_id", verDetalles);
router.post("/", crearDetalles);

module.exports = router;
