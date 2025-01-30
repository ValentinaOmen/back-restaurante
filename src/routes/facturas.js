import Router from "express";
import { actualizar, buscar, eliminar, listar, registrar } from "../controller/facturas.js";
import { validarToken } from "../controller/seguridad.controller.js";

const rutaFacturas = Router();

rutaFacturas.get("/listar", validarToken, listar);
rutaFacturas.post("/registrar", validarToken, registrar);
rutaFacturas.put("/actualizar/:id_factura", validarToken, actualizar);
rutaFacturas.get("/buscar/:id_factura", validarToken, buscar);
rutaFacturas.delete("/eliminar/:id_factura", validarToken, eliminar);

export default rutaFacturas;
