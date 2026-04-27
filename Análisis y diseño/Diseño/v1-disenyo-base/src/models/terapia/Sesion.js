const mongoose = require('mongoose');

// V1: Data class - solo almacena datos, sin comportamiento propio
// Toda la lógica vive en el controlador (problema: responsabilidad mal ubicada)
const sesionSchema = new mongoose.Schema({
  pacienteId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' },
  actividadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad' },
  fecha:       { type: Date, default: Date.now },
  tipo:        { type: String },
  estado:      { type: String },
  aciertos:    { type: Number, default: 0 },
  errores:     { type: Number, default: 0 },
  notas:       { type: String }
});

module.exports = mongoose.model('Sesion', sesionSchema);
