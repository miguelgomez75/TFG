const mongoose = require('mongoose');

// RUP: renombrado de Registro → RegistroClinico para coincidir con
// RegistroClinicoController y RegistroClinicoRepository del diagrama.
// El campo 'tipo' diferencia REGISTRO normal de RECOMENDACION
// (getRecomendaciones filtra por tipo: 'RECOMENDACION').
const registroClinicoSchema = new mongoose.Schema({
  pacienteId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' },
  usuarioId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  actividadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad' },
  titulo:      { type: String, required: true },
  contenido:   { type: String },
  tipo:        {
    type: String,
    enum: ['REGISTRO', 'RECOMENDACION', 'NOTA'],
    default: 'REGISTRO'
  },
  fecha:       { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('RegistroClinico', registroClinicoSchema);
