const mongoose = require('mongoose');

const asignacionSchema = new mongoose.Schema({
  pacienteId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' },
  actividadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad' },
  estado:      { type: String, default: 'PENDIENTE' }
});

module.exports = mongoose.model('AsignacionActividad', asignacionSchema);
