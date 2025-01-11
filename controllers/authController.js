const jwt = require("jsonwebtoken");
const pool = require("../database/db");

// Controlador para autenticar el usuario
const login = async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  try {
    // Buscar el usuario por nombre de usuario
    const result = await pool.query("SELECT * FROM usuarios WHERE nombre_usuario = $1", [nombre_usuario]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    const user = result.rows[0];

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    if (user.contrasena !== contrasena) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Crear el payload del token
    const payload = {
      id: user.id,
      nombre_usuario: user.nombre_usuario,
      rol: user.rol, // Puedes usar este campo para permisos en rutas protegidas
    };

    // Generar un token JWT (con una expiración de 1 hora)
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Devolver el token al cliente
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error en el servidor (^///^)");
  }
};

module.exports = { login };
