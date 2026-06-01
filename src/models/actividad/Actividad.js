const mongoose = require('mongoose');

// RUP: editarActividad() y crearActividad() incluyen categoriaId.
// Se añade la referencia a Categoria y se mantiene toda la lógica
// de ciclo de vida de V3.
const actividadSchema = new mongoose.Schema({
  titulo:          { type: String, required: true },
  descripcion:     { type: String },
  nivelDificultad: { type: Number, min: 1, max: 5 },
  estado:          {
    type: String,
    enum: ['BORRADOR', 'DISPONIBLE', 'ARCHIVADA'],
    default: 'BORRADOR'
  },
  categoriaId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }, // ← RUP
  tipo:            { type: String, enum: ['PICTOGRAMA', 'AUDIO', 'TEXTO', 'VIDEO'], required: true },
  contenido:       { type: Object }
}, { timestamps: true });

// Ciclo de vida (del V3, se mantiene)
actividadSchema.methods.publicar = function () {
  if (this.estado !== 'BORRADOR') throw new Error('Solo se puede publicar desde Borrador');
  this.estado = 'DISPONIBLE';
};

actividadSchema.methods.archivar = function () {
  if (this.estado !== 'DISPONIBLE') throw new Error('Solo se puede archivar desde Disponible');
  this.estado = 'ARCHIVADA';
};

actividadSchema.methods.estaDisponible = function () {
  return this.estado === 'DISPONIBLE';
};

module.exports = mongoose.model('Actividad', actividadSchema);
