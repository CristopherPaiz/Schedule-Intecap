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

// ======= obtener todos los usuarios =======
router.get("/user/getallLabel", async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, "nombre apellido").where({
      estado: true,
    }); // Proyecta solo nombre y apellido

    // Mapear los resultados para cambiar el nombre de los campos
    const usuariosTransformados = usuarios.map((usuario) => {
      return {
        label: usuario.nombre + " " + usuario.apellido,
        value: usuario._id,
      };
    });

    res.status(200).json(usuariosTransformados);
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

// ======= obtener usuario por id =======

// ======= actualizar un usuario por su id =======
router.get("/user/getbyid/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const resultado = await Usuario.findById(id);

    if (resultado) {
      res.status(200).json(resultado.cursos);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({
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
router.delete("/user/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await Usuario.findByIdAndRemove(id);
    if (resultado) {
      res.status(200).json({ message: "Usuario Eliminado correctamente", resultado });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo eliminar el Usuario",
      messageSys: error.message,
    });
  }
});

// ======= DISPONIBILIDAD POR DOCENTE =======
router.post("/user/comprobarDisponibilidad", async (req, res) => {
  try {
    const { fechaInicio, fechaFinal, horarioInicio, horarioFinal, IDdocente, dias } = req.body;

    const usuario = await Usuario.findOne({ _id: IDdocente });

    if (!usuario) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const cursos = usuario.cursos;

    for (const curso of cursos) {
      if (
        curso.fechaInicio <= fechaFinal &&
        curso.fechaFinal >= fechaInicio &&
        curso.dias.some((dia) => dias.includes(dia))
      ) {
        // Comprobación de colisión de fechas y días
        if (
          curso.horario.some(
            (hora) =>
              isWithinRange(hora, horarioInicio, horarioFinal) ||
              isWithinRange(horarioInicio, hora, curso.horario[curso.horario.length - 1])
          )
        ) {
          // Colisión de horarios
          return res.status(403).json({
            disponible: false,
            mensaje: "Motivo: Colisión con el Docente " + curso.docente,
            curso: curso.nombre,
            fechaInicio: curso.fechaInicio,
            fechaFinal: curso.fechaFinal,
            dias: curso.dias,
            horarioInicio: curso.horario[0],
            horarioFinal: curso.horario[curso.horario.length - 1],
          });
        }
      }
    }

    // Si no se encontraron colisiones, entonces está disponible
    res.status(200).json({ disponible: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// ======= Buscar disponibilidad por nombre del taller =======
router.post("/user/comprobarDisponibilidadPorTaller", async (req, res) => {
  try {
    const { fechaInicio, fechaFinal, horarioInicio, horarioFinal, nombreTaller, dias } = req.body;

    const usuarios = await Usuario.find();

    const usuariosConTaller = usuarios.filter((usuario) => {
      const cursosConTaller = usuario.cursos.filter((curso) => curso.taller === nombreTaller);
      return cursosConTaller.length > 0;
    });

    for (const usuario of usuariosConTaller) {
      const cursos = usuario.cursos;

      for (const curso of cursos) {
        if (
          curso.fechaInicio <= fechaFinal &&
          curso.fechaFinal >= fechaInicio &&
          curso.dias.some((dia) => dias.includes(dia))
        ) {
          // Comprobación de colisión de fechas y días
          if (
            curso.horario.some(
              (hora) =>
                isWithinRange(hora, horarioInicio, horarioFinal) ||
                isWithinRange(horarioInicio, hora, curso.horario[curso.horario.length - 1])
            )
          ) {
            // Colisión de horarios
            return res.status(403).json({
              disponible: false,
              mensaje: "Motivo: Colisión con " + nombreTaller,
              curso: curso.nombre,
              fechaInicio: curso.fechaInicio,
              fechaFinal: curso.fechaFinal,
              dias: curso.dias,
              horarioInicio: curso.horario[0],
              horarioFinal: curso.horario[curso.horario.length - 1],
            });
          }
        }
      }
    }

    // Si no se encontraron colisiones, entonces está disponible
    res.status(200).json({ disponible: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// Función para verificar si un horario está dentro de un rango
function isWithinRange(value, min, max) {
  return value >= min && value <= max;
}

// Ruta para eliminar un curso específico de los registros de docentes
router.delete("/user/deleteCursoEspecifico", async (req, res) => {
  try {
    const { nombre, descripcion, docente, taller } = req.body;

    // Obtener todos los docentes
    const docentes = await Usuario.find();

    // Iterar a través de los docentes y sus cursos para eliminar los cursos que coinciden
    docentes.forEach(async (docente) => {
      const cursos = docente.cursos;
      const cursosActualizados = [];

      cursos.forEach((curso) => {
        // Verificar si el curso coincide con los parámetros
        if (curso.nombre === nombre && curso.descripcion === descripcion && curso.taller === taller) {
        } else {
          // Mantener el curso ya que no coincide con los parámetros
          cursosActualizados.push(curso);
        }
      });

      // Actualizar la lista de cursos del docente
      docente.cursos = cursosActualizados;

      // Guardar el docente actualizado en la base de datos
      await docente.save();
    });

    res.status(200).json({ message: "Cursos eliminados correctamente" });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudieron eliminar los cursos",
      messageSys: error.message,
    });
  }
});

module.exports = router;
