const express = require("express");
const router = express.Router();
const Curso = require("../models/cursosModel.js");

//======= crear un nuevo Curso =======
router.post("/curso/add", async (req, res) => {
  try {
    const { nombre, codigoCurso, descripcion, fechaInicio, fechaFinal, horario, taller, docente, dias, foto, estado } =
      req.body;

    const curso = new Curso({
      nombre,
      codigoCurso,
      descripcion,
      fechaInicio,
      fechaFinal,
      horario,
      taller,
      docente,
      dias,
      foto,
      estado,
    });

    // Guardar el objeto curso en la base de datos u otras operaciones necesarias
    const resultado = await curso.save();

    //mandamos estado 200 de OK y el resultado de la operacion
    res.status(200).json({ message: "Curso añadido correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir el Curso",
      messageSys: error.message,
    });
  }
});

// ======= obtener todos los cursos =======
router.get("/curso/getall", async (req, res) => {
  try {
    const data = await Curso.find().sort({ nombre: 1 }).where({ estado: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los Cursos",
      messageSys: error.message,
    });
  }
});

// ======= obtener un Curso por su username =======
router.post("/curso/getbyid", async (req, res) => {
  try {
    const { id } = req.body;

    const curso = await Curso.find({ id });

    if (!curso) {
      return res.status(403).json({ message: "El curso no existe" });
    }

    res.status(200).json(curso);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener al curso por el ID",
      messageSys: error.message,
    });
  }
});

// ======= actualizar un curso por su id =======
router.put("/curso/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // Verificar si el nuevo username ya existe en otros Cursos
    const existingCurso = await Curso.findOne({ nombre: data.nombre });

    if (existingCurso && existingCurso._id.toString() !== id) {
      return res.status(400).json({ message: "El nombre del curso ya existe" });
    }

    const options = { new: true };
    const resultado = await Curso.findByIdAndUpdate(id, data, options);

    if (resultado) {
      res.status(200).json({ message: "Curso actualizado correctamente", resultado });
    } else {
      res.status(404).json({ message: "Curso no encontrado" });
    }
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo actualizar al Curso",
      messageSys: error.message,
    });
  }
});

// ======= eliminar un curso por su id =======
router.delete("/curso/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await Curso.findByIdAndRemove(id);
    if (resultado) {
      res.status(200).json({ message: "Curso Eliminado correctamente", resultado });
    } else {
      res.status(404).json({ message: "Curso no encontrado" });
    }
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo eliminar el Curso",
      messageSys: error.message,
    });
  }
});

module.exports = router;
