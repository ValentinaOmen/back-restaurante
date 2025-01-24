const express = require("express");
const { verPedidos, crearPedido, actualizarPedido } = require("../controllers/pedidosController");

const router = express.Router();

router.get("/", verPedidos);
router.post("/", crearPedido);
router.put("/:id", actualizarPedido); 

module.exports = router;

