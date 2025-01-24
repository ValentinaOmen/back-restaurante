import Router from "express";
import { actualizar, buscar, eliminar, listar, registrar } from "../controller/restaurante.controller.js";
import { validarToken } from "../controller/seguridad.controller.js";

const rutaRestaurantes = Router();

rutaRestaurantes.get("/listar", validarToken, listar);
rutaRestaurantes.post("/registrar", validarToken, registrar);
rutaRestaurantes.put("/actualizar/:id_restaurante", validarToken, actualizar);
rutaRestaurantes.get("/buscar/:id_restaurante", validarToken, buscar);
rutaRestaurantes.delete("/eliminar/:id_restaurante", validarToken, eliminar);

export default rutaRestaurantes;
