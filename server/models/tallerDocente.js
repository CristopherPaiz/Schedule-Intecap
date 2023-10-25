const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tallerDocenteSchema = new Schema({
  nombre: {
    type: String,
    require: true,
  },
  salon: {
    type: String,
  },
  capacidad: {
    type: Number,
  },
  observaciones: {
    type: String,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("TallerDocente", tallerDocenteSchema);
