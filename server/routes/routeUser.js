const express = require("express");
const router = express.Router();
const Usuario = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

//======= crear un nuevo Usuario =======
router.post("/user/add", async (req, res) => {
  try {
    const { nombre, apellido, correo, cursos, rol, username, contrasenia, foto, estado } = req.body;

    const user = new Usuario({
      nombre,
      apellido,
      correo,
      cursos,
      rol,
      username,
      contrasenia,
      foto,
      estado,
    });

    // Guardar el objeto user en la base de datos u otras operaciones necesarias
    const resultado = await user.save();

    //mandamos estado 200 de OK y el resultado de la operacion
    res.status(200).json({ message: "Usuario añadido correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir al usuario",
      messageSys: error.message,
    });
  }
});

// ======= obtener todos los usuarios =======
router.get("/user/getall", async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, "nombre apellido correo cursos rol username").where({
      estado: true,
    }); // Proyecta solo nombre y apellido
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener a los usuarios",
      messageSys: error.message,
    });
  }
});

// ======= obtener un usuario por su username =======
router.post("/user/getbyusername", async (req, res) => {
  try {
    const { username, contrasenia } = req.body;

    // Buscar al usuario por el nombre de usuario en la base de datos
    const user = await Usuario.findOne({ username });

    if (!user) {
      return res.status(403).json({ message: "El usuario no existe" });
    }

    // Verificar si el campo "estado" del usuario es falso
    if (!user.estado) {
      return res.status(403).json({ message: "El usuario ha sido eliminado, contacte al administrador" });
    }

    // Verificar si la contraseña coincide con la almacenada en la base de datos
    if (user.contrasenia !== contrasenia) {
      return res.status(401).json({ message: "Contraseña inválida" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    const { nombre, foto, rol, _id } = user;

    // Devolver una cookie para guardar el token con una duración de 15 días y que sea solo accesible por HTTP y no por JS
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 15,
      sameSite: "none",
      secure: true,
      httpOnly: false,
    });

    // Usuario y contraseña son válidos, devolver solo los campos requeridos
    res.status(200).json({ _id, nombre, foto, rol, username, token });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener al usuario por el username",
      messageSys: error.message,
    });
  }
});

// ======= actualizar un usuario por su id =======
router.put("/user/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // Verificar si el nuevo username ya existe en otros usuarios
    const existingUser = await Usuario.findOne({ username: data.username });

    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(400).json({ message: "El username ya existe" });
    }

    const options = { new: true };
    const resultado = await Usuario.findByIdAndUpdate(id, data, options);

    if (resultado) {
      res.status(200).json({ message: "Usuario actualizado correctamente", resultado });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo actualizar al usuario",
      messageSys: error.message,
    });
  }
});

// ======= eliminar un usuario por su id =======
router.put("/user/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await Usuario.findByIdAndUpdate(id, data, options);
    res.status(200).json({ message: "Usuario Eliminado correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo eliminar al usuario",
      messageSys: error.message,
    });
  }
});

module.exports = router;
