import Router from "express";
import { actualizar, buscar, eliminar, listar, registrar } from "../controller/detalles_pedidos.controller.js";
import { validarToken } from "../controller/seguridad.controller.js";

const rutaDPedidos = Router();

rutaDPedidos.get("/listar", validarToken, listar);
rutaDPedidos.post("/registrar", validarToken, registrar);
rutaDPedidos.put("/actualizar/:id_detalle", validarToken, actualizar);
rutaDPedidos.get("/buscar/:id_detalle", validarToken, buscar);
rutaDPedidos.delete("/eliminar/:id_detalle", validarToken, eliminar);

export default rutaDPedidos;
