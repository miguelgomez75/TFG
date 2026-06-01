const mongoose = require('mongoose');

// Patrón Experto en Información: la sesión conoce sus propias transiciones
// y métricas. Igual que V3, se mantiene para CdU-03 (realizarActividad)
// y CdU-05 (registrarSesion).
const sesionSchema = new mongoose.Schema({
  pacienteId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  actividadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actividad' },
  fecha:       { type: Date, default: Date.now },
  tipo:        { type: String, enum: ['PRESENCIAL', 'CASA'], required: true },
  estado:      {
    type: String,
    enum: ['INICIADA', 'EN_CURSO', 'PAUSADA', 'FINALIZADA', 'ABANDONADA'],
    default: 'INICIADA'
  },
  aciertos:    { type: Number, default: 0 },
  errores:     { type: Number, default: 0 },
  notas:       { type: String }
}, { timestamps: true });

// CdU-03: Familia registra respuestas durante la práctica
sesionSchema.methods.registrarRespuesta = function (esAcierto) {
  if (this.estado !== 'EN_CURSO') throw new Error('La sesión no está en curso');
  if (esAcierto) this.aciertos++;
  else this.errores++;
};

// Transiciones de estado
sesionSchema.methods.finalizar  = function () { this.estado = 'FINALIZADA'; };
sesionSchema.methods.abandonar  = function () { this.estado = 'ABANDONADA'; };
sesionSchema.methods.pausar     = function () {
  if (this.estado !== 'EN_CURSO') throw new Error('Solo pausar si está en curso');
  this.estado = 'PAUSADA';
};
sesionSchema.methods.reanudar   = function () {
  if (this.estado !== 'PAUSADA') throw new Error('Solo reanudar si está pausada');
  this.estado = 'EN_CURSO';
};

// CdU-06: ProgresoController.calcularMetricas() delega este cálculo al modelo
sesionSchema.methods.getPorcentajeAciertos = function () {
  const total = this.aciertos + this.errores;
  return total === 0 ? 0 : Math.round((this.aciertos / total) * 100);
};

sesionSchema.methods.estaFinalizada = function () {
  return this.estado === 'FINALIZADA';
};

module.exports = mongoose.model('Sesion', sesionSchema);
