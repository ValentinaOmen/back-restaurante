import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import "dotenv/config.js";

import rutaSeguridad from "./src/routes/seguridad.routes.js";
import rutaUsuarios from "./src/routes/usuario.routes.js";
import rutaRestaurantes from "./src/routes/restaurantes.routes.js";
import rutaProductos from "./src/routes/productos.routes.js";
import rutaPedidos from "./src/routes/pedidos.routes.js";
import rutaFacturas from "./src/routes/facturas.routes.js";
import rutaDPedidos from "./src/routes/detalles_pedidos.routes.js";

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Rutas
app.use(rutaSeguridad);
app.use("/usuarios", rutaUsuarios);
app.use("/restaurantes", rutaRestaurantes);
app.use("/productos", rutaProductos);
app.use("/pedidos", rutaPedidos);
app.use("/facturas", rutaFacturas);
app.use("/detallesP", rutaDPedidos);

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor funcionando en el puerto 3000");
});
