import Router from "express";
import { actualizar, buscar, eliminar, listar, registrar } from "../controller/productos.controller.js";
import { validarToken } from "../controller/seguridad.controller.js";

const rutaProductos = Router();

rutaProductos.get("/listar", validarToken, listar);
rutaProductos.post("/registrar", validarToken, registrar);
rutaProductos.put("/actualizar/:id_producto", validarToken, actualizar);
rutaProductos.get("/buscar/:id_producto", validarToken, buscar);
rutaProductos.delete("/eliminar/:id_producto", validarToken, eliminar);

export default rutaProductos;
