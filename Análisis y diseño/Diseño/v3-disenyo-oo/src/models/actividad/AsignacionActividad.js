const mongoose = require('mongoose');

const asignacionSchema = new mongoose.Schema({
  pacienteId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  actividadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad', required: true },
  estado:      { type: String, enum: ['PENDIENTE','EN_PROGRESO','COMPLETADA'], default: 'PENDIENTE' }
}, { timestamps: true });

// V2: el objeto sabe gestionar su propio estado
asignacionSchema.methods.iniciar   = function() { this.estado = 'EN_PROGRESO'; };
asignacionSchema.methods.completar = function() { this.estado = 'COMPLETADA'; };

module.exports = mongoose.model('AsignacionActividad', asignacionSchema);
