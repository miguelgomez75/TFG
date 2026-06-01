const mongoose = require('mongoose');

// RUP: findActivos() requiere campo 'activo' en el modelo.
// PacienteController.listarPacientesActivos() filtra por activo: true.
const pacienteSchema = new mongoose.Schema({
  nombre:          { type: String, required: true },
  fechaNacimiento: { type: Date },
  nivelActual:     { type: String },
  activo:          { type: Boolean, default: true },   // ← nuevo para RUP
  usuarioId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { timestamps: true });

module.exports = mongoose.model('Paciente', pacienteSchema);
