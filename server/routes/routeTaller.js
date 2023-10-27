const express = require("express");
const router = express.Router();
const Taller = require("../models/tallerDocente.js");

//======= crear un nuevo Taller =======
router.post("/taller/add", async (req, res) => {
  try {
    const { nombre, salon, capacidad, observaciones, estado } = req.body;
    const taller = new Taller({
      nombre,
      salon,
      capacidad,
      observaciones,
      estado,
    });

    // Guardar el objeto Taller en la base de datos u otras operaciones necesarias
    const resultado = await taller.save();

    //mandamos estado 200 de OK y el resultado de la operacion
    res.status(200).json({ message: "Taller añadido correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo añadir el Taller",
      messageSys: error.message,
    });
  }
});

// ======= obtener todos los Tallers =======
router.get("/taller/getall", async (req, res) => {
  try {
    const data = await Taller.find().sort({ nombre: 1 }).where({ estado: true });

    const noAplica = {
      _id: "0",
      nombre: "No Aplica (Virtual, Externo, Otros)",
      salon: "No Aplica",
      capacidad: "No Aplica",
      observaciones: "No Aplica",
      estado: true,
    };

    // Agregar el Taller "No Aplica" al inicio del array
    data.unshift(noAplica);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los Talleres",
      messageSys: error.message,
    });
  }
});

// ======= obtener todos los Tallers =======
router.get("/taller/getallSinNoAplica", async (req, res) => {
  try {
    const data = await Taller.find().sort({ nombre: 1 }).where({ estado: true });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener los Talleres",
      messageSys: error.message,
    });
  }
});

// ======= obtener un Taller por su username =======
router.post("/taller/getbyid", async (req, res) => {
  try {
    const { id } = req.body;

    const taller = await Taller.find({ id });

    if (!Taller) {
      return res.status(403).json({ message: "El Taller no existe" });
    }

    res.status(200).json(taller);
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo obtener al Taller por el ID",
      messageSys: error.message,
    });
  }
});

// ======= actualizar un Taller por su id =======
router.put("/taller/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // Verificar si el nuevo username ya existe en otros Tallers
    const existingTaller = await Taller.findOne({ nombre: data.nombre });

    if (existingTaller && existingTaller._id.toString() !== id) {
      return res.status(400).json({ message: "El nombre del Taller ya existe" });
    }

    const options = { new: true };
    const resultado = await Taller.findByIdAndUpdate(id, data, options);

    if (resultado) {
      res.status(200).json({ message: "Taller actualizado correctamente", resultado });
    } else {
      res.status(404).json({ message: "Taller no encontrado" });
    }
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo actualizar al Taller",
      messageSys: error.message,
    });
  }
});

// ======= eliminar un Taller por su id =======
router.put("/taller/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const options = { new: true };
    const resultado = await Taller.findByIdAndUpdate(id, data, options);
    res.status(200).json({ message: "Taller Eliminado correctamente", resultado });
  } catch (error) {
    res.status(500).json({
      messageDev: "No se pudo eliminar al Taller",
      messageSys: error.message,
    });
  }
});

module.exports = router;
