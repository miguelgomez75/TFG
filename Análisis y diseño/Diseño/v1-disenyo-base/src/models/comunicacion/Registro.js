const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
  pacienteId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' },
  usuarioId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  actividadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad' },
  titulo:      { type: String },
  contenido:   { type: String },
  tipo:        { type: String },
  fecha:       { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registro', registroSchema);
