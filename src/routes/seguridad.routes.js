import { Router } from "express";
import { validar, registroPublico } from "../controller/seguridad.controller.js";

const rutaSeguridad = Router();

rutaSeguridad.post("/validacion", validar);
rutaSeguridad.post("/registrar", registroPublico);  

export default rutaSeguridad;
