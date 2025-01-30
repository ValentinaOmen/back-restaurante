import Router from "express";
import { actualizar, buscar, eliminar, listar, registrarUsuario } from "../controller/usuario.js";
import { validarToken } from "../controller/seguridad.controller.js";

const rutaUsuarios = Router();

rutaUsuarios.get("/listar", validarToken, listar);
rutaUsuarios.post("/registrar", validarToken, registrarUsuario); // Registro administrativo
rutaUsuarios.put("/actualizar/:id_usuario", validarToken, actualizar);
rutaUsuarios.get("/buscar/:id_usuario", validarToken, buscar);
rutaUsuarios.delete("/eliminar/:id_usuario", validarToken, eliminar);

export default rutaUsuarios;
