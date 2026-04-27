const mongoose = require('mongoose');

// V2 CORRECCIÓN (Data Class → clase con comportamiento):
// Actividad sabe gestionar su propio ciclo de vida
// Misplaced Responsibility corregido: la lógica vuelve al modelo
const actividadSchema = new mongoose.Schema({
  titulo:          { type: String, required: true },
  descripcion:     { type: String },
  nivelDificultad: { type: Number, min: 1, max: 5 },
  estado:          { type: String, enum: ['BORRADOR','DISPONIBLE','ARCHIVADA'], default: 'BORRADOR' },
  categoriaId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  tipo:            { type: String, enum: ['PICTOGRAMA','AUDIO','TEXTO'], required: true },
  contenido:       { type: Object }
}, { timestamps: true });

actividadSchema.methods.publicar = function() {
  if (this.estado !== 'BORRADOR') throw new Error('Solo se puede publicar desde Borrador');
  this.estado = 'DISPONIBLE';
};

actividadSchema.methods.archivar = function() {
  if (this.estado !== 'DISPONIBLE') throw new Error('Solo se puede archivar desde Disponible');
  this.estado = 'ARCHIVADA';
};

actividadSchema.methods.estaDisponible = function() {
  return this.estado === 'DISPONIBLE';
};

module.exports = mongoose.model('Actividad', actividadSchema);
