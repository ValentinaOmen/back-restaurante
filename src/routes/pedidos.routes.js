import Router from "express";
import { actualizar, buscar, eliminar, listar, registrar } from "../controller/pedidos.controller.js";
import { validarToken } from "../controller/seguridad.controller.js";

const rutaPedidos = Router();

rutaPedidos.get("/listar", validarToken, listar);
rutaPedidos.post("/registrar", validarToken, registrar);
rutaPedidos.put("/actualizar/:id_pedido", validarToken, actualizar);
rutaPedidos.get("/buscar/:id_pedido", validarToken, buscar);
rutaPedidos.delete("/eliminar/:id_pedido", validarToken, eliminar);

export default rutaPedidos;
