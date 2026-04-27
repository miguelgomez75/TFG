const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  nombre:          { type: String },
  fechaNacimiento: { type: Date },
  nivelActual:     { type: String },
  usuarioId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Paciente', pacienteSchema);
